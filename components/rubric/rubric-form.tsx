"use client";

import type React from "react";
import type { z } from "zod";
import RubricInput from "./rubric-input";
import { Button } from "rubricui";
import RubricDropdown from "./rubric-dropdown";
import { toast } from "sonner";
import { type rubricSchema, formActionSchema } from "@/app/schema";

export default function RubricForm(
	props: z.infer<typeof rubricSchema.components.form>,
) {
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const formDataObject: Record<string, string> = {};
		formData.forEach((value, key) => {
			formDataObject[key] = value.toString();
		});
		toast("Form Data", {
			description: <pre>{JSON.stringify(formDataObject, null, 2)}</pre>,
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));

		toast.promise(formActionSchema[props.formAction.name].fn(formDataObject), {
			loading: "Making API Call...",
			success: (data) => {
				return data.message;
			},
		});
	}
	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit}
			className="flex flex-col gap-5"
		>
			{props.children.map((child) => {
				if (child.props.type === "show_input" || child.type === "show_input") {
					return (
						<RubricInput
							key={child.props.setterValue}
							name={child.props.setterValue}
							props={
								child.props as z.infer<typeof rubricSchema.components.input>
							}
						/>
					);
				}
				if (child.props.type === "show_dropdown" || child.type === "show_dropdown") {
					return (
						<RubricDropdown
							key={child.props.setterValue}
							name={child.props.setterValue}
							props={
								child.props as z.infer<typeof rubricSchema.components.dropdown>
							}
						/>
					);
				}
			})}
			<Button className="w-1/2" type="submit">
				Submit
			</Button>
		</form>
	);
}
