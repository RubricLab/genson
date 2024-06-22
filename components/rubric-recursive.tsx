import type { z } from "zod";
import type { rubricSchema } from "@/app/action";
import RubricButton from "./rubric-button";
import RubricInput from "./rubric-input";

export default function RubricRecursiveBox(
	props: z.infer<typeof rubricSchema.components.tooltip>,
) {
	if (props.type === "show_button") {
		return <RubricButton label={props.label} onClick={props.onClick} />;
	}

	if (props.type === "show_input") {
		return <RubricInput size={props.size} placeholder={props.placeholder} />;
	}

	return (
		<div className="bg-zinc-500/50 border-2 p-2 border-green-500">
			{props.text}
			{props.recChild && (
				<RubricRecursiveBox
					{...props.recChild.props}
					type={props.recChild.type}
				/>
			)}
		</div>
	);
}
