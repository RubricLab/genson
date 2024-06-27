import { z } from "zod";
import OpenAI from "openai";

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

// TODO: Actions and Blocks

const formActionSchema = {

	// TODO: z.infer<typeof> for args
	// Schema, function code, name of the function for each "Action"
	sightSeeingTours: { // Action Type, args are a zod object
		args: [
			{ name: "The name of the person" },
			{ email: "The email of the person" },
			{ participants: "The number of participants" },
			{ city: "The city of the person" }
		],
		fn: async (args) => {
			console.log("Booking sight-seeing tour:", args);
			// Simulating an API call or booking process
			await new Promise(resolve => setTimeout(resolve, 1000));
			return {
				success: true,
				message: `Tour booked for ${args.name} (account: ${args.email}) in ${args.city} for ${args.participants} participants.`
			};
		},
	},

	chatGPTCall: {
		args: [
			{ message: "The message to send to ChatGPT" }
		],
		fn: async (args) => {
			console.log("Calling ChatGPT:", args);
			// Simulating an API call or ChatGPT call
			await new Promise(resolve => setTimeout(resolve, 1000));

			const openai = new OpenAI({
				apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
				dangerouslyAllowBrowser: true 
			});
	
			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant that can answer questions and help with tasks."
					},
					{
						role: "user",
						content: args.message
					}
				],
				stream: false
			});

			return {
				success: true,
				message: `Response: ${response.choices[0].message.content}`
			};
		},
	},
	goNuts: {
		args: [],
		fn: async (args) => {
			console.log(args)
			return {
				success: true,
				message: `Going nuts: ${JSON.stringify(args)}`
			};
		},
	}
};

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
			recChild: z.custom<"Recursive">().describe("Should only be an input"),
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
		// TODO: use ZOD discriminated Union of different types (each function is a type)
		form: z.object({
			formAction: z.union([
				z.literal("sightSeeingTours").describe(`Required the following args: ${JSON.stringify(formActionSchema.sightSeeingTours.args)}`),
				z.literal("chatGPTCall").describe(`Required the following args: ${JSON.stringify(formActionSchema.chatGPTCall.args)}`),
				z.literal("goNuts").describe("For arbitrary args, use anything")
			  ]),
			children: z
				.array(z.custom<"Recursive">()).describe("Use props with type and the args for the component")
				.describe("The children of the form. Must be either input or dropdown.  Number of components must match the number of arguments in the formAction"),
		}).describe("Use the exact same argument keys in the formAction for the component setterValues in the form"),
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

export { buttonActions, formActionSchema };
