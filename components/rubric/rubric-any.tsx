import type { rubricSchema } from "@/app/schema";
import React from "react";
import type { RecursiveType } from "@/app/schema";
import RubricButton from "./rubric-button";
import type { z } from "zod";
import RubricInput from "./rubric-input";
import RubricViewer from "./rubric-viewer";
import RubricForm from "./rubric-form";

export default function RubricAny(props: RecursiveType) {
	switch (props.type) {
		case "button":
			return (
				<RubricButton
					{...(props.props as z.infer<typeof rubricSchema.components.button>)}
				/>
			);
		case "input":
			return (
				<RubricInput
					props={props.props as z.infer<typeof rubricSchema.components.input>}
				/>
			);
		case "viewer":
			return (
				<RubricViewer
					props={props.props as z.infer<typeof rubricSchema.components.viewer>}
					parent={false}
				/>
			);
		case "form":
			return (
				<RubricForm
					{...(props.props as z.infer<typeof rubricSchema.components.form>)}
				/>
			);
		default:
			return <div>Unknown: {props.type}</div>;
	}
}
