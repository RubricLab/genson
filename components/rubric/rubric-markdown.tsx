"use client";

import { memo, type FC } from "react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/lib/utils";

export type ComponentProps = {
	node: Node;
	namespaceid: string;
	children: React.ReactNode;
};

interface Options {
	children: string;
	className?: string;
}

const MemoizedReactMarkdown: FC<Options> = memo(
	Markdown,
	(prevProps, nextProps) =>
		prevProps.children === nextProps.children &&
		prevProps.className === nextProps.className,
);

export default function RubricMarkdown({ children }: Options) {
	return (
		<div className="prose">
			<MemoizedReactMarkdown
				className={cn(
					"prose dark:prose-invert prose-sm break-words prose-p:leading-normal leading-normal prose-pre:p-0",
				)}
			>
				{children}
			</MemoizedReactMarkdown>
		</div>
	);
}
