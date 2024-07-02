"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useUIState, useAIState } from "ai/rsc";
import type { AI } from "./action";
import type { initialUIState } from "./page";
import { cn } from "@/lib/utils";

type Props = {
	messages: typeof initialUIState;
};

export default function Dashboard({ messages }: Props) {
	const [aiState, _t] = useAIState<typeof AI>();
	const [focusedId, setFocusedId] = useState<number>();

	useEffect(() => {
		setFocusedId(
			messages.filter((message) => message.role === "assistant").pop()?.id || 0,
		);
	}, [messages]);

	return (
		<div className="flex h-full items-center justify-center p-4 relative">
			<div>
				{messages
					.filter((message) => message.role === "assistant")
					.filter((message) => message.id === focusedId)
					.map((message) => (
						<div key={message.id}>
							<div>{message.display}</div>
						</div>
					))}
			</div>
			<div className="absolute bottom-0 flex m-4 gap-2 text-sm">
				{messages
					.filter((message) => message.role === "assistant")
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
		</div>
	);
}
