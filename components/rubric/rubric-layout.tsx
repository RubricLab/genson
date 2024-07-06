import type { rubricSchema } from "@/app/schema";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import React from "react";
import type { z } from "zod";
import RubricAny from "./rubric-any";
import IDBox from "../id-box";

export default function RubricLayout({
	props,
	parent = true,
}: {
	props: z.infer<typeof rubricSchema.components.layout>;
	parent?: boolean;
}) {
	return (
		<ResizablePanelGroup
			direction={props.direction}
			className={cn(
				parent
					? "rounded-lg border min-h-[400px] min-w-[800px]"
					: "w-full h-full relative",
			)}
		>
			<ResizablePanel
				defaultSize={50}
				className={cn(
					"flex flex-col items-center justify-center relative group",
					props.left_child.type !== "show_layout" ? "p-5" : "",
				)}
			>
				<RubricAny {...props.left_child} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel
				defaultSize={50}
				className={cn(
					"flex flex-col items-center justify-center relative group",
					props.right_child.type !== "show_layout" ? "p-5" : "",
				)}
			>
				<RubricAny {...props.right_child} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
