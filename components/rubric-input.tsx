import type { z } from "zod";
import type { rubricSchema } from "@/app/action";
import { Input } from "rubricui";
import { useSetAtom } from "jotai";
import dataStore from "./store";


export default function RubricInput(props: z.infer<typeof rubricSchema.components.input>) {
	const setDataStore = useSetAtom(dataStore);

	function postToDataStore(e: React.ChangeEvent<HTMLInputElement>) {
		setDataStore((prev) => ({ ...prev, [props.setterValue]: e.target.value }));
	}

	return <Input placeholder={props.placeholder} onChange={props.setterValue ? postToDataStore : undefined} size={props.size} />;
}