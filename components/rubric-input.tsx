import type { z } from "zod";
import type { rubricSchema } from "@/app/action";
import { Input } from "rubricui";

export default function RubricInput(props: z.infer<typeof rubricSchema.components.input>) {
	return <Input placeholder={props.placeholder} size={props.size} />;
}