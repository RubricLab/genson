import { queryActions, type rubricSchema } from "@/app/schema";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import React from "react";
import type { z } from "zod";

export default async function RubricDataTable(
	props: z.infer<typeof rubricSchema.components.dataTable>,
) {
	const data = await queryActions[props.dataAPI.name].fn(props.dataAPI.args);

	return (
		<Table className="overflow-auto">
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
							<TableCell key={`${index}-${cellIndex.toString()}`}>{row[column]}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
