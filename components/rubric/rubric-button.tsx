"use client";

import type { z } from "zod";
import { buttonActions, type rubricSchema } from "@/app/schema";
import { Button } from "rubricui";


export default function RubricButton(
	props: z.infer<typeof rubricSchema.components.button>,
) {
	return (
		<Button onClick={props.onClick ? buttonActions[props.onClick] : undefined}>
			{props.label}
		</Button>
	);
}