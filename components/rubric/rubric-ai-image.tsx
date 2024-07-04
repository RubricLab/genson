import React from "react";
import type { z } from "zod";
import { queryActions, type rubricSchema } from "@/app/schema";
import Image from "next/image";

export default async function RubricAiImage(
	props: z.infer<typeof rubricSchema.components.ai_image>,
) {
	const result = await queryActions.createImage.fn({
		prompt: props.prompt,
	});
    
	return <Image alt={props.prompt} src={result.url} width={result.width} height={result.height} />;
}
