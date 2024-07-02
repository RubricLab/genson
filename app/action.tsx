import { createAI, getMutableAIState, render, streamUI } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import RubricButton from "@/components/rubric/rubric-button";
import RubricInput from "@/components/rubric/rubric-input";
import RubricRecursiveBox from "@/components/rubric/rubric-recursive";
import WeatherCard from "@/components/weather-card";
import { anthropic } from "@ai-sdk/anthropic";
import RubricDropdown from "../components/rubric/rubric-dropdown";
import RubricForm from "@/components/rubric/rubric-form";
import { rubricSchema } from "./schema";
import RubricTable from "@/components/rubric/rubric-table";

function generateId() {
	return Math.floor(10000 + Math.random() * 90000).toString();
}

async function submitMessage(content: string) {
	"use server";
	const aiState = getMutableAIState<typeof AI>();

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
			"You are a powerful component rendering assistant that can render nested components too. If the user asks you to render a component, then just do that, DO NOT GIVE A DESCRIPTION OF WHAT YOU ARE DOING. JUST RENDER THE COMPONENT. If a component is allowed to have a nested component, it's provided schema will have a prop labeled recChild which which can take on the props of any component. Ex: { type: 'show_tooltip', props: { text: 'hello', recChild: { type: 'show_tooltip', props: { text: 'world', recChild: null } } } }. If a prop is not marked as optional, then it is imperative that you include it in the response or else the project will crash. Lastly, if the user doesn't give you required data values for a component, just fill in random ones. RecChild must have a type and props, which is the args for the nested component",
		messages: [
			{
				role: "user",
				content:
					"For components that must share data, the setterValue of the child and the getterValue of the parent must be the same. For example, this could be a input field changing something in a parent box, etc. Also, in forms, the number of arguments in the formAction must match the number of components in the form.",
			},
			{
				role: "assistant",
				content:
					"I'll be sure to remember that for you and make sure that the setterValue of the child and the getterValue of the parent are the same for components that must share data and that the number of arguments in the formAction must match the number of components in the form.",
			},
			{ role: "user", content },
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
					yield <Spinner />;
					return <RubricButton {...args} />;
				},
			},
			show_input: {
				description: "Show an input",
				parameters: rubricSchema.components.input,
				generate: async function* (args) {
					yield <Spinner />;
					return <RubricInput props={args} />;
				},
			},
			show_tooltip: {
				description: "Show a tooltip",
				parameters: rubricSchema.components.tooltip,
				generate: async function* (args) {
					yield <Spinner />;
					console.log(JSON.stringify(args, null, 2));
					return <RubricRecursiveBox {...args} />;
				},
			},
			show_weather_card: {
				description: "Show a weather card",
				parameters: rubricSchema.components.weatherCard,
				generate: async function* (args) {
					appendIdToNestedProps(args);
					yield <Spinner />;
					return <WeatherCard {...args} />;
				},
			},
			show_dropdown: {
				description: "Show a dropdown",
				parameters: rubricSchema.components.dropdown,
				generate: async function* (args) {
					yield <Spinner />;
					return <RubricDropdown props={args} />;
				},
			},
			show_form: {
				description: "Show a form with child components",
				parameters: rubricSchema.components.form,
				generate: async function* (args) {
					console.log(JSON.stringify(args, null, 2));
					yield <Spinner />;
					return <RubricForm {...args} />;
				},
			},
			show_table: {
				description: "Show a table",
				parameters: rubricSchema.components.table,
				generate: async function* (args) {
					yield <Spinner />;
					return <RubricTable {...args} />;
				},
			},
		},
	});

	return {
		id: Date.now(),
		role: "assistant",
		display: result.value
	};
}

const initialAIState: {
	role: "user" | "assistant" | "system" | "function";
	content: string;
	id?: string;
	name?: string;
}[] = [];

const initialUIState: {
	id: number;
	display: React.ReactNode;
}[] = [];

export const AI = createAI({
	actions: {
		submitMessage,
	},
	initialUIState,
	initialAIState,
});
