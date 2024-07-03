"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useUIState, useAIState } from "ai/rsc";
import type { AI } from "./action";
import type { initialUIState } from "./page";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, LayoutIcon } from "@radix-ui/react-icons";
import { TabsContent } from "@radix-ui/react-tabs";

type Props = {
	messages: typeof initialUIState;
};

export default function Dashboard({ messages }: Props) {
	const [aiState, _t] = useAIState<typeof AI>();
	const [focusedId, setFocusedId] = useState<number>();

	useEffect(() => {
		setFocusedId(
			messages
				.filter((message) => message.role === "assistant" && message.toolName)
				.pop()?.id || 0,
		);
	}, [messages]);

	return (
		<Tabs
			defaultValue="layout"
			className="flex h-full items-center justify-center p-4 relative"
		>
			<TabsList className="grid grid-cols-2 absolute top-0 m-4 w-fit">
				<TabsTrigger value="layout">
					<LayoutIcon />
				</TabsTrigger>
				<TabsTrigger value="code">
					<CodeIcon />
				</TabsTrigger>
			</TabsList>
			<TabsContent value="layout">
				{messages
					.filter(
						(message) =>
							message.role === "assistant" &&
							message.id === focusedId &&
							message.toolName,
					)
					.map((message) => (
						<div key={message.id}>
							<div>{message.display}</div>
						</div>
					))}
			</TabsContent>
			<TabsContent value="code">
				<div className="border rounded-md p-4 overflow-auto h-[90vh]">
					{aiState
						.filter(
							(message) => message.id === focusedId && message.role === "tool",
						)
						.map((message) => (
							<code
								key={message.id}
								className="w-full whitespace-pre text-sm flex"
							>
								{JSON.stringify(
									{ toolName: message?.name, ...JSON.parse(message.content) },
									null,
									2,
								)}
							</code>
						))}
				</div>
			</TabsContent>
			<div className="absolute bottom-0 flex m-4 gap-2 text-sm">
				{messages
					.filter((message) => message.role === "assistant" && message.toolName)
					.map((message, index) => (
						<button
							type="button"
							key={message.id}
							onClick={() => setFocusedId(message.id)}
							className={cn(
								"size-8 rounded-md border flex items-center justify-center",
								{
									"bg-white text-black": focusedId === message.id,
									"bg-black text-white": focusedId !== message.id,
								},
							)}
						>
							{index + 1}
						</button>
					))}
			</div>
		</Tabs>
	);
}
