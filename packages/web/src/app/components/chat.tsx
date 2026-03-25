"use client";

/**
 * AI chat component for querying ICP network data.
 *
 * Uses AI SDK v6 `useChat()` to stream responses from the `/api/chat`
 * route. Built with shadcn/ui primitives, Vercel Streamdown for
 * markdown rendering, and flex-col-reverse for auto-scroll.
 */

import { useChat } from "@ai-sdk/react";
import { getToolName, isToolUIPart } from "ai";
import { Check, Copy, Loader2, Send, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/** Human-readable labels for tool invocations. */
const TOOL_LABELS: Record<string, string> = {
  getNetworkStats: "Fetching network stats",
  getTimeSeries: "Fetching time series data",
  getGovernanceStats: "Fetching governance stats",
};

/** Example questions shown in the empty state. */
const SUGGESTIONS = [
  "How many nodes are running on the ICP network?",
  "What are the latest governance stats?",
  "Show me the transaction volume over time",
];

/** Returns a human-readable label for a tool name. */
const getToolLabel = (toolName: string): string => {
  return TOOL_LABELS[toolName] ?? `Running ${toolName}`;
};

/**
 * Chat interface for conversing with the ICP data assistant.
 *
 * Renders a scrollable message list inside a shadcn Card, with
 * Streamdown markdown rendering, Badge-based tool indicators,
 * and a Textarea input with Enter-to-submit.
 */
export const Chat = () => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status !== "ready";

  /** Sends the current input as a new message. */
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, isLoading, sendMessage],
  );

  /** Handles keyboard events for Textarea submission. */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  /** Copies text to the clipboard and shows a brief confirmation. */
  const handleCopy = useCallback(async (messageId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  /** Sends a suggestion as a message. */
  const handleSuggestion = useCallback(
    (text: string) => {
      if (isLoading) return;
      sendMessage({ text });
    },
    [isLoading, sendMessage],
  );

  return (
    <Card className="flex w-full max-w-2xl flex-col">
      <CardHeader>
        <CardTitle className="text-lg">ICP Assistant</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div
          className="flex h-96 flex-col-reverse overflow-y-auto px-4"
          aria-live="polite"
        >
          <div className="flex flex-col gap-3 py-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">
                  Ask me anything about the ICP network!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="h-auto whitespace-normal text-left text-xs"
                      onClick={() => handleSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              /** Collect all text parts for the copy button. */
              const fullText = message.parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");

              return (
                <div
                  key={message.id}
                  className={`group flex flex-col gap-1 ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  {message.parts.map((part, i) => {
                    const key = `${part.type}-${i}`;

                    if (part.type === "text") {
                      return isUser ? (
                        <div
                          key={key}
                          className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                        >
                          {part.text}
                        </div>
                      ) : (
                        <div
                          key={key}
                          className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <Markdown>{part.text}</Markdown>
                        </div>
                      );
                    }

                    if (isToolUIPart(part)) {
                      const label = getToolLabel(getToolName(part));
                      const isDone = part.state === "output-available";
                      const isError = part.state === "output-error";

                      return (
                        <Badge
                          key={key}
                          variant={
                            isError
                              ? "destructive"
                              : isDone
                                ? "secondary"
                                : "outline"
                          }
                          className="gap-1.5 font-normal"
                        >
                          {!isDone && !isError && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          {isDone && <Check className="h-3 w-3" />}
                          {isError && <X className="h-3 w-3" />}
                          {label}
                        </Badge>
                      );
                    }

                    return null;
                  })}

                  {/* Copy button for assistant messages */}
                  {!isUser && fullText && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleCopy(message.id, fullText)}
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="sr-only">Copy message</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      {/* Error display */}
      {error && (
        <div className="border-t px-4 py-2 text-sm text-destructive">
          Error: {error.message}
        </div>
      )}

      <CardFooter className="p-3">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the ICP network..."
            rows={1}
            className="min-h-[40px] flex-1 resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
