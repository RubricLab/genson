"use server";
import type { goNuts } from "./actions";
import type { z } from "zod";

export async function test(args: z.infer<typeof goNuts.shape.args>) {
	console.log("test", args);
	return "test";
}