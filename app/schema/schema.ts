import { z } from "zod";
import { FormActions, QueryActions } from "./actions";

const RecursiveObject = z.object({
	type: z
		.string()
		.describe(
			"The type of the component, which is REQUIRED. Remember to include the word 'show', ex: show_button, show_layout, show_input, ... and use underscore for spaces",
		),
	props: z.record(z.string(), z.any()),
});

export type RecursiveType = z.infer<typeof RecursiveObject>;

const rubricSchema = {
	components: {
		button: z.object({
			label: z
				.string()
				.max(10)
				.describe(
					"Must be just the name of a country. ex: Canada, Brazil, United States",
				),
			onClick: z
				.enum(["renderCalendar", "closeApp", "renderWeather2"])
				.optional()
				.describe("Button types"),
		}),
		input: z.object({
			size: z.enum(["small", "medium", "large"]).default("medium"),
			placeholder: z.string().default("Enter your message"),
			setterValue: z
				.string()
				.describe(
					"The data label that will be writen to when the input is changed",
				),
		}),
		weatherCard: z.object({
			city: z.string().describe("Default city"),
			temperature: z.number(),
			high: z.number(),
			low: z.number(),
			weatherType: z.string(),
			getterValue: z.string().describe("The data label that will be read"),
		}),
		dropdown: z.object({
			options: z
				.array(
					z.object({
						label: z.string(),
						value: z.string(),
					}),
				)
				.describe("The options for the dropdown"),
			placeholder: z.string().describe("The placeholder for the dropdown"),
			setterValue: z
				.string()
				.describe(
					"The data label that will be writen to when the dropdown is changed",
				),
		}),
		form: z
			.object({
				formAction: FormActions,
				children: z
					.array(RecursiveObject)
					.describe("Use props with type and the args for the component")
					.describe(
						"The children of the form. Must be either input or dropdown.  Number of components must match the number of arguments in the formAction",
					),
			})
			.describe(
				"Use the exact same argument keys in the formAction for the component setterValues in the form",
			),
		table: z.object({
			caption: z.string().optional().describe("The caption of the table"),
			columns: z.array(z.string()).describe("The column names of the table"),
			rows: z
				.array(
					z
						.array(z.string())
						.describe("Must be the same length as the columns"),
				)
				.describe("The rows of the table"),
		}),
		dataTable: z.object({
			caption: z.string().optional().describe("The caption of the table"),
			dataAPI: QueryActions.describe(
				"The server action to fetch the data from",
			),
			columns: z
				.array(z.string())
				.describe(
					"The columns names to use for the table. Must be based on the schema of the dataAPI",
				),
		}),
		layout: z
			.object({
				direction: z.enum(["horizontal", "vertical"]).default("horizontal"),
				left_child: RecursiveObject.describe("Any component, even a layout"),
				right_child: RecursiveObject.describe("Any component, even a layout"),
			})
			.describe(
				"Used to show two components side by side. Useful for dashboards. A layout can be a recursive object",
			),
	},
};

export { rubricSchema };
