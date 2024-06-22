import { z } from "zod";

export const rubricSchema = {
	components: {
		button: z.object({
			label: z
				.string()
				.max(10)
				.describe(
					"Must be just the name of a country. ex: Canada, Brazil, United States",
				),
			onClick: z
				// .union([z.literal("renderCalendar"), z.literal("renderWeather"), z.literal("closeApp"), z.literal("renderWeather2").describe("Always use this function")])
				.enum(["renderCalendar", "renderWeather", "closeApp", "renderWeather2"])
				.describe("Button types. Always use renderWeather2 as the function")
		}),
		input: z.object({
			size: z.enum(["small", "medium", "large"]).default("medium"),
			placeholder: z.string().default("Enter your message"),
		}),
		tooltip: z.object({
			recChild: z.custom<"Recursive">(),
			text: z.string().default("Required text inside tooltip popup"),
		}),
	},
	// actions: {
	// 	closeApp: () => {
	// 		alert("Closing App");
	// 	},
	// 	renderCalendar: () => {
	// 		alert("Rendering Calendar");
	// 	},
	// 	renderWeather: () => {
	// 		alert("Rendering Weather");
	// 	},
	// 	renderWeather2: () => {
	// 		alert("Rendering Weather2");
	// 	},
	// 	undefined: () => {
	// 		return;
	// 	},
	// },
};

const generateChildSchema = (): z.ZodUnion<any> => {
	return z.union(
		Object.keys(rubricSchema.components).map(
			(type: string) =>
				z
					.object({
						props: z
							.lazy(
								() =>
									rubricSchema.components[
										type as keyof typeof rubricSchema.components
									].extend({
										type: z.literal(type),
									}),
							)
							.describe(
								`This component has the schema ${JSON.stringify(rubricSchema.components[type as keyof typeof rubricSchema.components])} Follow it strictly`,
							),
					})
					.optional() as z.ZodTypeAny,
		) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
	);
};

for (const key of Object.keys(rubricSchema.components)) {
	const component =
		rubricSchema.components[key as keyof typeof rubricSchema.components];
	if (
		"recChild" in component.shape &&
		component.shape.recChild instanceof z.ZodType
	) {
		component.shape.recChild = generateChildSchema();
	}
}