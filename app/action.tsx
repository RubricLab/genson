"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import RubricButton from "@/components/rubric/rubric-button";
import RubricInput from "@/components/rubric/rubric-input";
import WeatherCard from "@/components/weather-card";
import { anthropic } from "@ai-sdk/anthropic";
import RubricDropdown from "../components/rubric/rubric-dropdown";
import RubricForm from "@/components/rubric/rubric-form";
import { rubricSchema } from "./schema";
import RubricTable from "@/components/rubric/rubric-table";
import RubricLayout from "@/components/rubric/rubric-layout";
import { generateId } from "ai";
import { initialAIState, initialUIState } from "./page";

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
			"You are a powerful component rendering assistant that can render nested components too. Whenever you make a tool call, a new message will be appended to history saying TOOL CALL. DO NOT WRITE THIS YOURSELF, just use the tools! If the user asks you to render a component, then just do that, DO NOT GIVE A DESCRIPTION OF WHAT YOU ARE DOING. JUST RENDER THE COMPONENT. Use the context of the conversation to iteratively improve/update the component. If a component is allowed to have a nested component, it's provided schema will have a prop labeled recChild which which can take on the props of any component. Ex: { type: 'show_tooltip', props: { text: 'hello', recChild: { type: 'show_tooltip', props: { text: 'world', recChild: null } } } }. If a prop is not marked as optional, then it is imperative that you include it in the response or else the project will crash. Lastly, if the user doesn't give you required data values for a component, just fill in random ones. RecChild must have a type and props, which is the args for the nested component",
		messages: [
			{
				role: "user",
				content:
					"Unless, the user says anything, If the user did not specify what to add for a component prop (ex: button name, form action, etc.), ask for clarification. For components that must share data, the setterValue of the child and the getterValue of the parent must be the same. For example, this could be a input field changing something in a parent box, etc. Also, in forms, the number of arguments in the formAction must match the number of components in the form.",
			},
			{
				role: "assistant",
				content:
					"I'll be sure to remember that for you and make sure that the setterValue of the child and the getterValue of the parent are the same for components that must share data and that the number of arguments in the formAction must match the number of components in the form.",
			},
			// TODO: find better way to do this with Claude Sonnet. Issue: Tool_use
			...(aiState.get() as typeof initialAIState).slice(-5).map((message) => ({
				...message,
				role: message.role === "tool" ? "assistant" : message.role,
				content: message.content,
			})),
		],

		text: ({ content, done }) => {
			if (done) {
				aiState.done([
					...aiState.get(),
					{
						role: "assistant",
						content,
					},
				]);
			}
			return <div>{content}</div>;
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
