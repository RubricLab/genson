"use server";
import { OpenAI } from "openai";
import type { z } from "zod";
import type {
	ChatGPTCall,
	fetchTodosSchema,
	goNuts,
	sightSeeingTours,
} from "./actions";

export async function test(args: z.infer<typeof goNuts.shape.args>) {
	console.log("test", args);
	return "test";
}

export async function fetchTodos(
	args: z.infer<typeof fetchTodosSchema.shape.args>,
): Promise<z.infer<typeof fetchTodosSchema.shape.returns>> {
	const url = args.postId
		? `https://jsonplaceholder.typicode.com/posts?id=${args.postId}`
		: "https://jsonplaceholder.typicode.com/posts";
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

export async function makeChatGPTCall(
	args: z.infer<typeof ChatGPTCall.shape.args>,
): Promise<string> {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [{ role: "user", content: args.message }],
	});
	return response.choices[0].message.content || "";
}

export async function makeSightSeeingTour(
	args: z.infer<typeof sightSeeingTours.shape.args>,
): Promise<string> {
	return `Tour booked for ${args.name} (account: ${args.email}) in ${args.city}`;
}
