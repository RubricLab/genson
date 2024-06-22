"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/dropdown";
import { z } from "zod";
import { rubricSchema } from "@/app/schema";
import { useSetAtom } from "jotai";
import dataStore from "./store";

export default function RubricDropdown(
	props: z.infer<typeof rubricSchema.components.dropdown>,
) {
	const setDataStore = useSetAtom(dataStore);

	function handleValueChange(value: string) {
		if (props.setterValue) {
			setDataStore((prev) => ({ ...prev, [props.setterValue]: value }));
		}
	}

    return (
	<Select onValueChange={(value) => handleValueChange(value)}>
		<SelectTrigger className="w-[180px]">
			<SelectValue placeholder={props.placeholder} />
		</SelectTrigger>
		<SelectContent>
			{props.options.map((option: {label: string, value: string}, index: number) => (
				<SelectItem key={index} value={option.value}>{option.label}</SelectItem>
			))}
		</SelectContent>
	</Select>
    )
}
