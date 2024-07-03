import { z } from "zod";
import { test } from "./server-actions";

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

export const goNuts = z.object({
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

				return {
					success: true,
					message: "Hello",
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
				z.promise(z.object({ success: z.boolean(), message: z.string() })),
			)
			.implement(async (args) => {
				const result = await test(args);
				return { success: true, message: result };
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

export { buttonActions, formActionSchema, FormActions };