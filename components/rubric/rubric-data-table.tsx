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
					{Object.keys(data[0])
						.filter((key) => !props.columns_to_remove.includes(key))
						.map((column, index) => (
							<TableHead key={column}>{column}</TableHead>
						))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row: any, index: number) => (
					<TableRow key={index.toString()}>
						{Object.keys(row)
							.filter((key) => !props.columns_to_remove.includes(key))
							.map((column, cellIndex) => (
								<TableCell key={`${index}-${cellIndex.toString()}`}>
									{row[column]}
								</TableCell>
							))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
