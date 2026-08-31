"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/quiz-data"

export type AnswerMap = Record<number, string>

interface QuizSectionProps {
  questions: Question[]
  answers: AnswerMap
  onAnswerChange: (questionId: number, value: string) => void
  onSubmit: () => void
}

export function QuizSection({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
}: QuizSectionProps) {
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id].trim() !== "",
  ).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground">생성된 문제</h2>
        <span className="text-sm text-muted-foreground">
          {answeredCount} / {questions.length} 응답
        </span>
      </div>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          value={answers[question.id] ?? ""}
          onChange={(value) => onAnswerChange(question.id, value)}
        />
      ))}

      <Button size="lg" onClick={onSubmit} className="mt-1 w-full gap-2 text-base">
        <CheckCircle2 className="size-4" aria-hidden />
        채점하기
      </Button>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  value,
  onChange,
}: {
  question: Question
  index: number
  value: string
  onChange: (value: string) => void
}) {
  const isConcept = question.category === "기본개념"

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {index + 1}
          </span>
          <Badge
            variant="secondary"
            className={cn(
              "font-medium",
              isConcept
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {question.category}
          </Badge>
        </div>
        <p className="text-base font-medium leading-relaxed text-pretty text-foreground">
          {question.prompt}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        {question.kind === "multiple" ? (
          <div role="radiogroup" aria-label={`${index + 1}번 문제 선택지`} className="flex flex-col gap-2">
            {question.options.map((option, optionIndex) => {
              const selected = value === String(optionIndex)
              return (
                <button
                  key={optionIndex}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(String(optionIndex))}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{option}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor={`answer-${question.id}`} className="sr-only">
              {index + 1}번 문제 답 입력
            </Label>
            <Input
              id={`answer-${question.id}`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="답을 입력해 주세요"
              className="h-11 text-base"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
