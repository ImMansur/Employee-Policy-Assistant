"use client"
import { Clock, Home, Plane, FileText, Sparkles } from "lucide-react"

interface WelcomeScreenProps {
  employeeName: string
  onQuickQuestion: (question: string) => void
}

const quickQuestions = [
  {
    icon: Clock,
    label: "Working hours",
    question: "What are the official working hours at Lara Tech Consulting?",
    bgColor: "bg-sky-100 dark:bg-sky-950/50",
    iconBg: "bg-sky-200 dark:bg-sky-900",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: Home,
    label: "Remote work",
    question: "What is the remote or hybrid work policy?",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/50",
    iconBg: "bg-emerald-200 dark:bg-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Plane,
    label: "Leave policy",
    question: "What leave options are available to employees?",
    bgColor: "bg-amber-100 dark:bg-amber-950/50",
    iconBg: "bg-amber-200 dark:bg-amber-900",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: FileText,
    label: "Company policies",
    question: "What are the key company policies I should know about?",
    bgColor: "bg-pink-100 dark:bg-pink-950/50",
    iconBg: "bg-pink-200 dark:bg-pink-900",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
]

export function WelcomeScreen({ employeeName, onQuickQuestion }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 overflow-auto">
      <div className="text-center max-w-2xl w-full">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold shadow-xl shadow-primary/30">
          <Sparkles className="h-8 w-8" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, {employeeName}</h1>
        <p className="mt-2 text-muted-foreground text-base">
          I'm the Employee Policy Assistant for Lara Tech Consulting.
        </p>
        <p className="text-sm text-muted-foreground">Ask me anything from the official Employee Handbook.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {quickQuestions.map((item) => (
            <button
              key={item.label}
              className={`group relative flex flex-col items-start gap-3 rounded-xl p-5 text-left ${item.bgColor} border border-transparent hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg min-h-[140px]`}
              onClick={() => onQuickQuestion(item.question)}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden w-full">
                <p className="font-semibold text-foreground text-base">{item.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.question}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-secondary/50 p-4 border border-border/50">
          <h3 className="text-sm font-semibold text-foreground">What you can ask about</h3>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {["Working hours", "Shifts", "Remote work", "Hybrid policy", "Leave", "Holidays", "Company rules"].map(
              (topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/50 hover:border-primary/50 hover:text-foreground transition-all duration-200 cursor-default hover:scale-105"
                >
                  {topic}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
