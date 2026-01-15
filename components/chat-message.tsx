"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "./chat"
import { User, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group flex gap-4 py-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-110",
          isUser
            ? "bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground"
            : "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/20",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : "LT"}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2", isUser && "text-right")}>
        <div
          className={cn(
            "relative inline-block rounded-2xl px-4 py-3 text-sm transition-all duration-200",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-lg shadow-primary/20"
              : "bg-secondary text-secondary-foreground rounded-bl-md hover:bg-secondary/80",
          )}
        >
          <div
            className={cn(
              "prose prose-sm max-w-none",
              isUser ? "prose-invert text-primary-foreground" : "text-secondary-foreground",
            )}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-10 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-secondary hover:scale-110 active:scale-95"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
