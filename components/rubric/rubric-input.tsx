"use client";

import type { z } from "zod";
import type { rubricSchema } from "@/app/schema";
import { Input } from "rubricui";
import { useSetAtom } from "jotai";
import dataStore from "../../lib/store";

export default function RubricInput({
	props,
	name = "",
}: { props: z.infer<typeof rubricSchema.components.input>; name?: string }) {
	const setDataStore = useSetAtom(dataStore);

	function postToDataStore(e: React.ChangeEvent<HTMLInputElement>) {
		setDataStore((prev) => ({ ...prev, [props.setterValue]: e.target.value }));
	}

	return (
		<Input
			name={name}
			placeholder={props.placeholder}
			onChange={props.setterValue ? postToDataStore : undefined}
			size={props.size}
		/>
	);
}
