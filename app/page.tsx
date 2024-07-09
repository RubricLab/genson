"use client";

import { BotMessage, UserMessage } from "@/components/message";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useActions, useUIState } from "ai/rsc";
import { useState } from "react";
import { Textarea } from "rubricui";
import type { AI } from "./action";
import Dashboard from "./dashboard";
import { useSession } from "next-auth/react";
import Profile from "@/components/profile";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export const initialAIState: {
	role: "user" | "assistant" | "system" | "tool";
	content: string;
	id?: string;
	name?: string;
}[] = [];

export const initialUIState: {
	id: number;
	display: React.ReactNode;
	role: "user" | "assistant" | "system" | "tool";
	text?: string;
	toolName?: string;
}[] = [];

export default function Page() {
	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useUIState<typeof AI>();
	const { submitMessage } = useActions();
	const session = useSession();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" || e.key === "NumpadEnter") {
			e.preventDefault();
			e.currentTarget.form?.requestSubmit();
		}
	};

	return (
		<ResizablePanelGroup direction="horizontal" className="rounded-lg border">
			<ResizablePanel defaultSize={30}>
				<div className="flex flex-col space-y-4 justify-end h-full p-4">
					<div className="flex flex-col space-y-4 flex-1 overflow-y-auto">
						{messages.map((message) => (
							<div key={message.id}>
								{message.role === "user" ? (
									<UserMessage>{message.display}</UserMessage>
								) : (
									<BotMessage>{message.text}</BotMessage>
								)}
							</div>
						))}
					</div>

					<form
						className="space-y-2"
						onSubmit={async (e) => {
							e.preventDefault();

							const value = inputValue.trim();

							setMessages((currentMessages) => [
								...currentMessages,
								{
									id: Date.now(),
									role: "user",
									display: value,
								},
							]);
							setInputValue("");

							const responseMessage = await submitMessage(value);
							setMessages((currentMessages) => [
								...currentMessages,
								responseMessage,
							]);
						}}
					>
						<Textarea
							placeholder="Write a command... (e.g. create a form)"
							value={inputValue}
							size="large"
							onChange={(event) => {
								setInputValue(event.target.value);
							}}
							onKeyDown={handleKeyDown}
							className="border border-border rounded-md p-2 w-full focus:outline-none"
						/>
					</form>
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={70} maxSize={80} minSize={70} className="relative">
				{messages.length > 0 && <Dashboard messages={messages} />}
				<Profile image={session.data?.user?.image || ""} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
