"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Trash2, X, Building2 } from "lucide-react"
import type { Conversation } from "./chat"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  isOpen: boolean
  onClose: () => void
  employeeName: string
  employeeId: string
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
  employeeName,
  employeeId,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sidebar-foreground" />
            <span className="font-semibold text-sidebar-foreground">Policy Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent hover:scale-110 active:scale-95 transition-all duration-200"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 shrink-0">
          <Button
            onClick={onNewConversation}
            className="w-full justify-start gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            {conversations.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">No conversations yet</p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm cursor-pointer transition-all duration-200",
                    activeConversationId === conversation.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md scale-[1.02]"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:scale-[1.01] active:scale-[0.99]",
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-200",
                      activeConversationId === conversation.id ? "text-primary" : "group-hover:text-primary",
                    )}
                  />
                  <span className="flex-1 truncate">{conversation.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/20 hover:text-destructive hover:scale-110 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conversation.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer - Updated to show Mansur as the name */}
        <div className="border-t border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3 hover:bg-sidebar-accent transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.99]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 shrink-0">
              {employeeName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{employeeName}</p>
              <p className="text-xs text-muted-foreground truncate">{employeeId}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
