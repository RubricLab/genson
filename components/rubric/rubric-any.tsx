import type { rubricSchema } from "@/app/schema";
import type { RecursiveType } from "@/app/schema";
import React from "react";
import type { z } from "zod";
import WeatherCard from "../weather-card";
import RubricButton from "./rubric-button";
import RubricDataTable from "./rubric-data-table";
import RubricDropdown from "./rubric-dropdown";
import RubricForm from "./rubric-form";
import RubricInput from "./rubric-input";
import RubricLayout from "./rubric-layout";
import RubricTable from "./rubric-table";
import RubricMarkdown from "./rubric-markdown";

const componentMap = {
	show_button: (props: z.infer<typeof rubricSchema.components.button>) => (
		<RubricButton {...props} />
	),
	show_input: (props: z.infer<typeof rubricSchema.components.input>) => (
		<RubricInput props={props} />
	),
	show_layout: (props: z.infer<typeof rubricSchema.components.layout>) => (
		<RubricLayout props={props} parent={false} />
	),
	show_form: (props: z.infer<typeof rubricSchema.components.form>) => (
		<RubricForm {...props} />
	),
	show_weather_card: (
		props: z.infer<typeof rubricSchema.components.weatherCard>,
	) => <WeatherCard {...props} />,
	show_dropdown: (props: z.infer<typeof rubricSchema.components.dropdown>) => (
		<RubricDropdown props={props} />
	),
	show_table: (props: z.infer<typeof rubricSchema.components.table>) => (
		<RubricTable {...props} />
	),
	show_data_table: (
		props: z.infer<typeof rubricSchema.components.dataTable>,
	) => <RubricDataTable {...props} />,
	show_markdown: (props: z.infer<typeof rubricSchema.components.markdown>) => (
		<RubricMarkdown>{props.markdown}</RubricMarkdown>
	),
};

export default function RubricAny(props: RecursiveType) {
	const Component = componentMap[props.type as keyof typeof componentMap];
	return Component ? (
		// biome-ignore lint/suspicious/noExplicitAny: Not defined to a specific type of component
		Component(props.props as any)
	) : (
		<div>Unknown: {props.type}</div>
	);
}
