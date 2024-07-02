"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "./action";
import { UserMessage } from "@/components/message";
import { Button, Input, Textarea } from "rubricui";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();

  return (
    <div className="flex flex-col space-y-4">
      {
        // View messages in UI state
        messages.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))
      }

      <form
        className="space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();

          const value = inputValue.trim();

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);
          setInputValue("");
          // Submit and get response message
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
          className="border border-border rounded-md p-2 w-3/5 focus:outline-none"
        />
        <Button size="small" type="submit">Send</Button>
      </form>
    </div>
  );
}
