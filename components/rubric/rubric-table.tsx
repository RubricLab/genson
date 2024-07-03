"use client";

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
import type { rubricSchema } from "@/app/schema";

export default function RubricTable(
	props: z.infer<typeof rubricSchema.components.table>,
) {
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
				{props.rows.map((row, index) => (
					<TableRow key={index.toString()}>
						{row.map((cell, index) => (
							<TableCell key={index.toString()}>{cell}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
