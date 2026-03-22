"use client";

/**
 * AI chat component for querying ICP network data.
 *
 * Uses AI SDK v6 `useChat()` to stream responses from the `/api/chat`
 * route, rendering message parts including text and tool invocations.
 */

import { useChat } from "@ai-sdk/react";
import { getToolName, isToolUIPart } from "ai";
import { useState } from "react";

/** Human-readable labels for tool invocations. */
const TOOL_LABELS: Record<string, string> = {
  getNetworkStats: "Fetching network stats",
  getTimeSeries: "Fetching time series data",
  getGovernanceStats: "Fetching governance stats",
};

/**
 * Returns a human-readable label for a tool name.
 */
function getToolLabel(toolName: string): string {
  return TOOL_LABELS[toolName] ?? `Running ${toolName}`;
}

/**
 * Chat interface for conversing with the ICP data assistant.
 *
 * Renders a scrollable message list, tool invocation indicators,
 * and a text input for sending messages.
 */
export function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  /** Sends the current input as a new message. */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  const isLoading = status !== "ready";

  return (
    <div className="flex w-full max-w-2xl flex-col rounded-lg border border-gray-200">
      {/* Message list */}
      <div className="flex h-96 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            Ask me anything about the ICP network!
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {message.parts.map((part, i) => {
              const key = `${part.type}-${i}`;

              if (part.type === "text") {
                return (
                  <div
                    key={key}
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {part.text}
                  </div>
                );
              }

              if (isToolUIPart(part)) {
                const label = getToolLabel(getToolName(part));
                const isDone = part.state === "output-available";
                const isError = part.state === "output-error";

                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
                  >
                    {!isDone && !isError && (
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    )}
                    {isDone && <span>&#10003;</span>}
                    {isError && <span className="text-red-500">&#10007;</span>}
                    <span>
                      {label}
                      {isDone ? " — done" : isError ? " — error" : "..."}
                    </span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="border-t border-gray-200 px-4 py-2 text-sm text-red-500">
          Error: {error.message}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the ICP network..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
