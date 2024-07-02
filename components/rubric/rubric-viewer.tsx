import React from "react";
import type { z } from "zod";
import type { rubricSchema } from "@/app/schema";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import RubricAny from "./rubric-any";
import { cn } from "@/lib/utils";

export default function RubricViewer({
	props,
	parent = true,
}: {
	props: z.infer<typeof rubricSchema.components.viewer>;
	parent?: boolean;
}) {
	return (
		<ResizablePanelGroup
			direction={props.direction}
			className={cn(
				parent
					? "rounded-lg border min-h-[400px] min-w-[800px]"
					: "w-full h-full",
			)}
		>
			<ResizablePanel
				defaultSize={50}
				className={cn(
					"flex flex-col items-center justify-center",
					props.left_child.type !== "viewer" ? "p-5" : "",
				)}
			>
				<RubricAny {...props.left_child} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel
				defaultSize={50}
				className={cn(
					"flex flex-col items-center justify-center",
					props.right_child.type !== "viewer" ? "p-5" : "",
				)}
			>
				<RubricAny {...props.right_child} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
