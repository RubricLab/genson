import { z } from "zod";
import {
	fetchTodos,
	makeChatGPTCall,
	makeSightSeeingTour,
	test,
} from "./server-actions";

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

const QueryAction = Action.extend({
	fn: z.function().args(z.any()).returns(z.any()),
});

type QueryActionType = z.infer<typeof QueryAction>;

export const ChatGPTCall = z.object({
	name: z.literal("chatGPTCall"),
	args: z.object({
		message: z.string().describe("The message to send to ChatGPT"),
	}),
});

export const sightSeeingTours = z.object({
	name: z.literal("sightSeeingTours"),
	args: z.object({
		name: z.string(),
		email: z.string(),
		city: z.string(),
	}),
});

export const goNuts = z.object({
	name: z.literal("goNuts"),
	args: z.record(z.any()),
});

export const fetchTodosSchema = z.object({
	name: z.literal("fetchTodos"),
	args: z.object({
		postId: z.number().optional().describe("If render all posts, leave empty"),
	}),
	returns: z
		.array(
			z.object({
				userId: z.number(),
				id: z.number(),
				title: z.string(),
				body: z.string(),
			}),
		)
		.describe("The resolved promise of the fetchTodos action"),
});

const FormActions = z.discriminatedUnion("name", [
	sightSeeingTours,
	ChatGPTCall,
	goNuts,
]);

function genSchemaDesc(schema: z.ZodObject<any, any, any>) {
	const keys = Object.keys(schema.shape);
	const types = keys.map((key) => schema.shape[key]);

	return Object.fromEntries(
		keys.map((key, index) => [key, types[index]._def.typeName]),
	);
}

const QueryActions = z.discriminatedUnion("name", [
	fetchTodosSchema
		.omit({ returns: true })
		.describe(
			`Returns values with the following schema: ${JSON.stringify(
				genSchemaDesc(fetchTodosSchema.shape.returns.element),
			)}`,
		),
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
				const result = await makeSightSeeingTour(args);
				return {
					success: true,
					message: result,
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
				const result = await makeChatGPTCall(args);
				return {
					success: true,
					message: result,
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

const queryActions: Record<
	z.infer<typeof QueryActions>["name"],
	QueryActionType
> = {
	fetchTodos: {
		name: fetchTodosSchema.shape.name.value,
		args: fetchTodosSchema.shape.args,
		fn: z
			.function()
			.args(fetchTodosSchema.shape.args)
			.returns(z.promise(fetchTodosSchema.shape.returns))
			.implement(async (args) => {
				const result = await fetchTodos(args);
				return result;
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

export {
	buttonActions,
	formActionSchema,
	FormActions,
	queryActions,
	QueryActions,
};
