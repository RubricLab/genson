"use server";
import type { goNuts, fetchTodosSchema } from "./actions";
import type { z } from "zod";

export async function test(args: z.infer<typeof goNuts.shape.args>) {
	console.log("test", args);
	return "test";
}

export async function fetchTodos(
	args: z.infer<typeof fetchTodosSchema.shape.args>,
) {
	const url = args.postId
		? `https://jsonplaceholder.typicode.com/posts?id=${args.postId}`
		: "https://jsonplaceholder.typicode.com/posts";
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
	return data;
}
