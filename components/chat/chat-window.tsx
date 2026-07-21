"use client";

import { useEffect, useRef, useState } from "react";
import { Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MockProvider } from "@/lib/mock-providers";

interface ChatMessage {
  id: string;
  from: "client" | "provider";
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const autoReplies = [
  "Thanks for reaching out — happy to help with that.",
  "Yes, we can accommodate that. Could you share the exact date and flight details?",
  "Noted. I'll confirm availability and get back to you shortly.",
  "That works on our end — feel free to send a booking request whenever you're ready.",
];

export function ChatWindow({ provider }: { provider: MockProvider }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed-1",
      from: "provider",
      text: `Hi, this is ${provider.businessName}. How can we help with your ${provider.serviceLabel.toLowerCase()}?`,
      time: now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [providerTyping, setProviderTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, providerTyping]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "client", text, time: now() },
    ]);
    setDraft("");
    setProviderTyping(true);

    setTimeout(() => {
      setProviderTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "provider",
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          time: now(),
        },
      ]);
    }, 1400);
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-4rem)] max-w-3xl flex-col px-6 py-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-800 text-sm font-semibold text-white">
          {provider.businessName
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{provider.businessName}</p>
          <p className="text-xs text-foreground-muted">{provider.serviceLabel}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 px-3 py-2 text-xs text-gold-400">
        <ShieldAlert className="size-3.5 shrink-0" />
        Keep all communication and payments within ProtocolLink for your protection.
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.from === "client" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                message.from === "client"
                  ? "bg-primary-600 text-white"
                  : "bg-background-secondary text-foreground"
              )}
            >
              <p>{message.text}</p>
              <p
                className={cn(
                  "mt-1 text-[10px]",
                  message.from === "client" ? "text-primary-100/70" : "text-foreground-muted"
                )}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}

        {providerTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-background-secondary px-4 py-2.5 text-sm text-foreground-muted">
              typing…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message"
          className="flex-1 rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm outline-none placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-primary-400"
        />
        <Button type="button" size="icon" onClick={sendMessage} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
