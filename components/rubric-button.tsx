"use client";

import type { z } from "zod";
import type { rubricSchema } from "@/app/action";
import { Button } from "rubricui";

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
		return
	},
};
export default function RubricButton(
	props: z.infer<typeof rubricSchema.components.button>,
) {
	return (
		<Button onClick={props.onClick ? buttonActions[props.onClick] : undefined}>
			{props.label}
		</Button>
	);
}