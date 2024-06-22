import type { z } from "zod";
import type { rubricSchema } from "@/app/action";
import RubricButton from "./rubric-button";
import RubricInput from "./rubric-input";
import RubricDropdown from "./rubric-dropdown";

export default function RubricRecursiveInput(
	props: z.infer<typeof rubricSchema.components.tooltip>,
) {

	if (props.type === "button") {
		return <RubricButton label={props.label} onClick={props.onClick} />;
	}

	if (props.type === "input") {
		return <RubricInput size={props.size} placeholder={props.placeholder} setterValue={props.setterValue} />;
	}

	if (props.type === "dropdown") {
		return <RubricDropdown options={props.options} placeholder={props.placeholder} setterValue={props.setterValue} />;
	}

	return (
		<div className="bg-zinc-500/50 border-2 p-2 border-green-500">
			{props.recChild && (
				<RubricRecursiveInput
					{...props.recChild.props}
					// type={props.recChild.type}
				/>
			)}
		</div>
	);
}
