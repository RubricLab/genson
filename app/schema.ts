import { z } from "zod";
import OpenAI from "openai";

const Action = z.object({
	name: z.string(),
	args: z.record(z.string(), z.any()),
	fn: z
		.function()
		.args(z.any())
		.returns(
			z.promise(
				z.object({
					success: z.boolean(),
					message: z.string(),
				}),
			),
		),
});

type ActionType = z.infer<typeof Action>;

const ChatGPTCall = z.object({
	name: z.literal("chatGPTCall"),
	args: z.object({
		message: z.string().describe("The message to send to ChatGPT"),
	}),
});

const sightSeeingTours = z.object({
	name: z.literal("sightSeeingTours"),
	args: z.object({
		name: z.string(),
		email: z.string(),
		participants: z.number(),
		city: z.string(),
	}),
});

const goNuts = z.object({
	name: z.literal("goNuts"),
	args: z.record(z.any()),
});

const FormActions = z.discriminatedUnion("name", [
	sightSeeingTours,
	ChatGPTCall,
	goNuts,
]);

const formActionSchema: Record<
	z.infer<typeof FormActions>["name"],
	ActionType
> = {
	sightSeeingTours: {
		name: sightSeeingTours.shape.name.value,
		args: sightSeeingTours.shape.args,
		fn: z
			.function()
			.args(sightSeeingTours.shape.args)
			.returns(
				z.promise(
					z.object({
						success: z.boolean(),
						message: z.string(),
					}),
				),
			)
			.implement(async (args) => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				return {
					success: true,
					message: `Tour booked for ${args.name} (account: ${args.email}) in ${args.city} for ${args.participants} participants.`,
				};
			}),
	},
	chatGPTCall: {
		name: ChatGPTCall.shape.name.value,
		args: ChatGPTCall.shape.args,
		fn: z
			.function()
			.args(ChatGPTCall.shape.args)
			.returns(
				z.promise(
					z.object({
						success: z.boolean(),
						message: z.string(),
					}),
				),
			)
			.implement(async (args) => {
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const openai = new OpenAI({
					apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
					dangerouslyAllowBrowser: true,
				});

				const response = await openai.chat.completions.create({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "system",
							content:
								"You are a helpful assistant that can answer questions and help with tasks.",
						},
						{
							role: "user",
							content: args.message,
						},
					],
					stream: false,
				});

				return {
					success: true,
					message: `Response: ${response.choices[0].message.content}`,
				};
			}),
	},
	goNuts: {
		name: goNuts.shape.name.value,
		args: goNuts.shape.args,
		fn: z
			.function()
			.args(goNuts.shape.args)
			.returns(
				z.promise(
					z.object({
						success: z.boolean(),
						message: z.string(),
					}),
				),
			)
			.implement(async (args) => {
				return {
					success: true,
					message: `Going nuts: ${JSON.stringify(args)}`,
				};
			}),
	},
};

const buttonActions = {
	closeApp: () => {
		alert("Closing App");
	},
	renderCalendar: () => {
		alert("Rendering Calendar");
	},
	renderWeather: () => {
		alert("Rendering Weather");
	},
	renderWeather2: () => {
		alert("Rendering Weather2");
	},
	undefined: () => {
		return;
	},
};

const RecursiveObject = z.object({
	type: z.string().describe("The type of the component, which is REQUIRED"),
	props: z.record(z.string(), z.any()),
});

export type RecursiveType = z.infer<typeof RecursiveObject>;

const rubricSchema = {
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
				.optional()
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
			recChild: RecursiveObject.describe("Should only be an input"),
			text: z.string().default("Required text inside tooltip popup"),
		}),
		weatherCard: z.object({
			city: z.string().describe("Default city"),
			temperature: z.number(),
			high: z.number(),
			low: z.number(),
			weatherType: z.string(),
			getterValue: z.string().describe("The data label that will be read"),
			recChild: RecursiveObject.describe("Should only be an input or dropdown. Remember to set the type of the component"),
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
		form: z
			.object({
				formAction: FormActions,
				children: z
					.array(RecursiveObject)
					.describe("Use props with type and the args for the component")
					.describe(
						"The children of the form. Must be either input or dropdown.  Number of components must match the number of arguments in the formAction",
					),
			})
			.describe(
				"Use the exact same argument keys in the formAction for the component setterValues in the form",
			),
		table: z.object({
			caption: z.string().optional().describe("The caption of the table"),
			columns: z.array(z.string()).describe("The column names of the table"),
			rows: z.array(z.array(z.string()).describe("Must be the same length as the columns")).describe("The rows of the table"),
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

export { buttonActions, formActionSchema, rubricSchema };
