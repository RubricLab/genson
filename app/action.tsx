import { createAI, getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import RubricButton from "@/components/rubric-button";
import RubricInput from "@/components/rubric-input";
import RubricRecursiveBox from "@/components/rubric-recursive";

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
				.enum(["renderCalendar", "renderWeather", "closeApp", "renderWeather2"])
				.describe("Button types. Always use renderWeather2 as the function"),
		}),
		input: z.object({
			size: z.enum(["small", "medium", "large"]).default("medium"),
			placeholder: z.string().default("Enter your message"),
		}),
		tooltip: z.object({
			recChild: z.custom<"Recursive">(),
			text: z.string().default("Required text inside tooltip popup"),
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

	const ui = render({
		provider: openai,
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "system",
				content:
					"You are a powerful component rendering assistant that can render nested components too. If a component is allowed to have a nested component, it's provided schema will have a prop labeled recChild which which can take on the props of any component. Ex: { type: 'show_tooltip', props: { text: 'hello', recChild: { type: 'show_tooltip', props: { text: 'world', recChild: null } } } }. If a prop is not marked as optional, then it is imperative that you include it in the response or else the project will crash.",
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
			return <BotMessage>{content}</BotMessage>;
		},
		tools: {
			show_button: {
				description: "Show a button",
				parameters: rubricSchema.components.button,
				render: async function* (args) {
					console.log(args);
					yield <Spinner />;
					return <RubricButton {...args} />;
				},
			},
			show_input: {
				description: "Show an input",
				parameters: rubricSchema.components.input,
				render: async function* (args) {
					yield <Spinner />;
					return <RubricInput {...args} />;
				},
			},
			show_tooltip: {
				description: "Show a tooltip",
				parameters: rubricSchema.components.tooltip,
				render: async function* (args) {
					yield <Spinner />;
					console.log(JSON.stringify(args, null, 2));
					return <RubricRecursiveBox {...args} />;
				},
			},
		},
	});

	return {
		id: Date.now(),
		display: ui,
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
