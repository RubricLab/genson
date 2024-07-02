"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/dropdown";
import type { z } from "zod";
import type { rubricSchema } from "@/app/schema";
import { useSetAtom } from "jotai";
import dataStore from "../../lib/store";

export default function RubricDropdown({ props, name = "" }: { props: z.infer<typeof rubricSchema.components.dropdown>, name?: string }) {
	const setDataStore = useSetAtom(dataStore);

	function handleValueChange(value: string) {
		if (props.setterValue) {
			setDataStore((prev) => ({ ...prev, [props.setterValue]: value }));
		}
	}

    return (
	<Select name={name} onValueChange={(value) => handleValueChange(value)}>
		<SelectTrigger className="w-[180px]">
			<SelectValue placeholder={props.placeholder} />
		</SelectTrigger>
		<SelectContent>
			{props.options.map((option: {label: string, value: string}, index: number) => (
				<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
			))}
		</SelectContent>
	</Select>
    )
}
