"use server";

import RubricButton from "@/components/rubric/rubric-button";
import RubricDataTable from "@/components/rubric/rubric-data-table";
import RubricForm from "@/components/rubric/rubric-form";
import RubricInput from "@/components/rubric/rubric-input";
import RubricLayout from "@/components/rubric/rubric-layout";
import RubricTable from "@/components/rubric/rubric-table";
import { Spinner } from "@/components/spinner";
import WeatherCard from "@/components/weather-card";
import { anthropic } from "@ai-sdk/anthropic";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import RubricDropdown from "../components/rubric/rubric-dropdown";
import { initialAIState, initialUIState } from "./page";
import { rubricSchema } from "./schema";
import RubricMarkdown from "@/components/rubric/rubric-markdown";
import RubricAiImage from "@/components/rubric/rubric-ai-image";

async function submitMessage(content: string) {
	"use server";
	const aiState = getMutableAIState();

	aiState.update([
		...aiState.get(),
		{
			role: "user",
			content: content,
		},
	]);

	const id = generateId();
	function appendIdToNestedProps(obj: Record<string, any>) {
		for (const key in obj) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				appendIdToNestedProps(obj[key]);
			} else if (key === "setterValue" || key === "getterValue") {
				obj[key] = `${obj[key]}-${id}`;
			}
		}
	}

	const result = await streamUI({
		model: anthropic("claude-3-5-sonnet-20240620"),
		system:
			"You are a powerful component rendering assistant that can render nested components too. Whenever you make a tool call, a new message will be appended to history saying TOOL CALL. DO NOT WRITE THIS YOURSELF, just use the tools! To render nested components, use layout. You can render any component inside of a layout (including ai image, tables, data tables, etc.). If the user asks you to render a component, then just do that, DO NOT GIVE A DESCRIPTION OF WHAT YOU ARE DOING. JUST RENDER THE COMPONENT. Use the context of the conversation to iteratively improve/update the component.",
		messages: [
			{
				role: "user",
				content:
					"Remember to render things next to each other, use layout (layouts can contain anything, including ai images!). Unless, the user says anything, If the user did not specify what to add for a component prop (ex: button name, form action, etc.), ask for clarification. For components that must share data, the setterValue of the child and the getterValue of the parent must be the same. For example, this could be a input field changing something in a parent box, etc. Also, in forms, the number of arguments in the formAction must match the number of components in the form.",
			},
			{
				role: "assistant",
				content:
					"I'll remember to use layouts to render anything next to each other. I'll be sure to also remember that for you and make sure that the setterValue of the child and the getterValue of the parent are the same for components that must share data and that the number of arguments in the formAction must match the number of components in the form.",
			},
			// TODO: find better way to do this with Claude Sonnet. Issue: Tool_use
			...(aiState.get() as typeof initialAIState).slice(-5).map((message) => ({
				...message,
				role: message.role === "tool" ? "assistant" : message.role,
				content: message.content,
			})),
		],

		text: async function* ({ content, done }) {
			yield <Spinner />;
			if (done) {
				aiState.done([
					...aiState.get(),
					{
						role: "assistant",
						content,
					},
				]);
			}
			return <Spinner />;
		},
		tools: {
			show_button: {
				description: "Show a button",
				parameters: rubricSchema.components.button,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_button",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <RubricButton {...args} />;
				},
			},
			show_input: {
				description: "Show an input",
				parameters: rubricSchema.components.input,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_input",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <RubricInput props={args} />;
				},
			},
			show_weather_card: {
				description: "Show a weather card",
				parameters: rubricSchema.components.weatherCard,
				generate: async function* (args) {
					appendIdToNestedProps(args);
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_weather_card",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <WeatherCard {...args} />;
				},
			},
			show_dropdown: {
				description: "Show a dropdown",
				parameters: rubricSchema.components.dropdown,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_dropdown",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <RubricDropdown props={args} />;
				},
			},
			show_form: {
				description: "Show a form with child components",
				parameters: rubricSchema.components.form,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_form",
							content: JSON.stringify(args),
						},
					]);
					console.log(JSON.stringify(args, null, 2));
					yield <Spinner />;
					return <RubricForm {...args} />;
				},
			},
			show_table: {
				description: "Show a table",
				parameters: rubricSchema.components.table,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_table",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <RubricTable {...args} />;
				},
			},
			show_data_table: {
				description: "Show a data table with data fetched from an API",
				parameters: rubricSchema.components.dataTable,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_data_table",
							content: JSON.stringify(args),
						},
					]);
					console.log("data table");
					console.log(JSON.stringify(args, null, 2));
					yield <Spinner />;
					return <RubricDataTable {...args} />;
				},
			},
			show_layout: {
				description: "Show a layout",
				parameters: rubricSchema.components.layout,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_layout",
							content: JSON.stringify(args),
						},
					]);
					console.log(JSON.stringify(args, null, 2));
					yield <Spinner />;
					return <RubricLayout props={args} />;
				},
			},
			show_markdown: {
				description: "Render markdown as HTML. Use * for bullet points.",
				parameters: rubricSchema.components.markdown,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_markdown",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					console.log(args.markdown);
					return <RubricMarkdown>{args.markdown}</RubricMarkdown>;
				},
			},
			show_ai_image: {
				description: "Show an image generated by an AI",
				parameters: rubricSchema.components.ai_image,
				generate: async function* (args) {
					aiState.done([
						...aiState.get(),
						{
							id: id,
							role: "tool",
							name: "show_ai_image",
							content: JSON.stringify(args),
						},
					]);
					yield <Spinner />;
					return <RubricAiImage {...args} />;
				},
			},
		},
	});

	let text = "";
	let toolName = "";
	for await (const chunk of result.stream as unknown as Array<any>) {
		switch (chunk.type) {
			case "text-delta":
				text += chunk.textDelta;
				break;
			case "tool-call":
				toolName = chunk.toolName;
				break;
		}
	}

	return {
		id: id,
		role: "assistant",
		display: result.value,
		text: text,
		toolName: toolName,
	};
}

export const AI = createAI({
	actions: {
		submitMessage,
	},
	onSetAIState: async ({ state, done }) => {
		"use server";

		if (done) {
			// TODO: Save State
		}
	},
	initialUIState,
	initialAIState,
});
