import { createAI, getMutableAIState, render, streamUI } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import RubricButton from "@/components/rubric-button";
import RubricInput from "@/components/rubric-input";
import RubricRecursiveBox from "@/components/rubric-recursive";
import WeatherCard from "@/components/weather-card";
import { anthropic } from "@ai-sdk/anthropic";
import RubricDropdown from "../components/rubric-dropdown";

function generateId() {
	return Math.floor(10000 + Math.random() * 90000).toString();
}

const openai = new OpenAI();

export const rubricSchema = {
	components: {
		button: z.object({
			label: z
				.string()
				.max(10)
				.describe(
					"Must be just the name of a country. ex: Canada, Brazil, United States",
				),
			onClick: z
				.enum(["renderCalendar", "closeApp", "renderWeather2"])
				.describe("Button types"),
		}),
		input: z.object({
			size: z.enum(["small", "medium", "large"]).default("medium"),
			placeholder: z.string().default("Enter your message"),
			setterValue: z
				.string()
				.describe(
					"The data label that will be writen to when the input is changed",
				),
		}),
		tooltip: z.object({
			// recChild: z.union([z.custom<"Recursive">(), z.null]).describe("Should only be an input"),
			text: z.string().default("Required text inside tooltip popup"),
		}),
		weatherCard: z.object({
			city: z.string().describe("Default city"),
			temperature: z.number(),
			high: z.number(),
			low: z.number(),
			weatherType: z.string(),
			getterValue: z.string().describe("The data label that will be read"),
			recChild: z
				.custom<"Recursive">()
				.describe("Should only be an input or dropdown"),
		}),
		dropdown: z.object({
			options: z
				.array(
					z.object({
						label: z.string(),
						value: z.string(),
					}),
				)
				.describe("The options for the dropdown"),
			placeholder: z.string().describe("The placeholder for the dropdown"),
			setterValue: z
				.string()
				.describe(
					"The data label that will be writen to when the dropdown is changed",
				),
		}),
	},
};

const generateChildSchema = (): z.ZodUnion<any> => {
	return z.union(
		Object.keys(rubricSchema.components).map(
			(type: string) =>
				z
					.object({
						props: z
							.lazy(() =>
								rubricSchema.components[
									type as keyof typeof rubricSchema.components
								].extend({
									type: z.literal(type),
								}),
							)
							.describe(
								`This component has the schema ${JSON.stringify(rubricSchema.components[type as keyof typeof rubricSchema.components])} Follow it strictly`,
							),
					})
					.optional() as z.ZodTypeAny,
		) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
	);
};

for (const key of Object.keys(rubricSchema.components)) {
	const component =
		rubricSchema.components[key as keyof typeof rubricSchema.components];
	if (
		"recChild" in component.shape &&
		component.shape.recChild instanceof z.ZodType
	) {
		component.shape.recChild = generateChildSchema();
	}
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
	function appendIdToNestedProps(obj) {
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
			"You are a powerful component rendering assistant that can render nested components too. If the user asks you to render a component, then just do that, DO NOT GIVE A DESCRIPTION OF WHAT YOU ARE DOING. JUST RENDER THE COMPONENT. If a component is allowed to have a nested component, it's provided schema will have a prop labeled recChild which which can take on the props of any component. Ex: { type: 'show_tooltip', props: { text: 'hello', recChild: { type: 'show_tooltip', props: { text: 'world', recChild: null } } } }. If a prop is not marked as optional, then it is imperative that you include it in the response or else the project will crash. Lastly, if the user doesn't give you required data values for a component, just fill in random ones.",
		messages: [
			{
				role: "user",
				content:
					"For components that must share data, the setterValue of the child and the getterValue of the parent must be the same. For example, this could be a input field changing something in a parent box, etc.",
			},
			{
				role: "assistant",
				content:
					"I'll be sure to remember that for you and make sure that the setterValue of the child and the getterValue of the parent are the same for components that must share data.",
			},
			// {role: "user", content: "I'll describe something to be rendered. Use your tools to create it and please don't talk, yap, or describe what you are doing since I am in a hurry!"},
			// {role: "assistant", content: "I'll create what you asked for and won't talk or yap!"},
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
					console.log(args);
					yield <Spinner />;
					return <RubricButton {...args} />;
				},
			},
			show_input: {
				description: "Show an input",
				parameters: rubricSchema.components.input,
				generate: async function* (args) {
					yield <Spinner />;
					return <RubricInput {...args} />;
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

					console.log(args);
					yield <Spinner />;
					return <WeatherCard {...args} />;
				},
			},
			show_dropdown: {
				description: "Show a dropdown",
				parameters: rubricSchema.components.dropdown,
				generate: async function* (args) {
					yield <Spinner />;
					return <RubricDropdown {...args} />;
				},
			},
		},
	});

	return {
		id: Date.now(),
		role: "assistant",
		display: result.value,
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
	// Each state can be any shape of object, but for chat applications
	// it makes sense to have an array of messages. Or you may prefer { id: number, messages: Message[] }
	initialUIState,
	initialAIState,
});
