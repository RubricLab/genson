"use client";

import type { rubricSchema } from "@/app/schema";
import { useSetAtom } from "jotai";
import { Input } from "rubricui";
import type { z } from "zod";
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
