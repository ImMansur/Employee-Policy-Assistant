"use client"

import { useState, useRef, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { WelcomeScreen } from "./welcome-screen"
import { Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const EMPLOYEE_ID = "EMP-2024-0847"
const EMPLOYEE_NAME = "Mansur"

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const messages = activeConversation?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
  }

  const handleSendMessage = async (content: string) => {
    let conversationId = activeConversationId

    if (!conversationId) {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
      }
      setConversations((prev) => [newConversation, ...prev])
      conversationId = newConversation.id
      setActiveConversationId(conversationId)
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = [...c.messages, userMessage]
          return {
            ...c,
            messages: updatedMessages,
            title: c.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : c.title,
          }
        }
        return c
      }),
    )

    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
            }
          }
          return c
        }),
      )
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, errorMessage],
            }
          }
          return c
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        employeeName={EMPLOYEE_NAME}
        employeeId={EMPLOYEE_ID}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-screen">
        {/* Header */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 bg-background/80 backdrop-blur-sm shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20">
              LT
            </div>
            <div>
              <h1 className="text-sm font-semibold">Lara Tech Consulting</h1>
              <p className="text-xs text-muted-foreground">Employee Policy Assistant</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 border border-border">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap">{EMPLOYEE_ID}</span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen employeeName={EMPLOYEE_NAME} onQuickQuestion={handleQuickQuestion} />
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 py-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
