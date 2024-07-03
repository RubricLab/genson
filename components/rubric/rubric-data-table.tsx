import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { z } from "zod";
import { queryActions, type rubricSchema } from "@/app/schema";

export default async function RubricDataTable(
	props: z.infer<typeof rubricSchema.components.dataTable>,
) {
	const data = await queryActions[props.dataAPI.name].fn(props.dataAPI.args);

	return (
		<Table>
			{props.caption && <TableCaption>{props.caption}</TableCaption>}
			<TableHeader>
				<TableRow>
					{props.columns.map((column, index) => (
						<TableHead key={column}>{column}</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row: any, index: number) => (
					<TableRow key={index.toString()}>
						{props.columns.map((column, cellIndex) => (
							<TableCell key={`${index}-${cellIndex}`}>{row[column]}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
