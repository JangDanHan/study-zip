"use client"

import { CheckCircle2, FileQuestion, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
  const progressPercentage = Math.round((answeredCount / questions.length) * 100)
  const hasUnanswered = answeredCount < questions.length

  return (
    <div className="flex flex-col gap-5">
      <Card className="border-border/70 shadow-sm bg-card/60 backdrop-blur-xs">
        <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileQuestion className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-bold text-foreground">퀴즈 풀이</h2>
            </div>
            <span className="text-sm font-semibold font-mono text-primary">
              {answeredCount} / {questions.length} 완료 ({progressPercentage}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            value={answers[question.id] ?? ""}
            onChange={(value) => onAnswerChange(question.id, value)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {hasUnanswered && (
          <p className="text-center text-xs text-amber-600 dark:text-amber-400 font-medium">
            💡 아직 답하지 않은 문제({questions.length - answeredCount}개)는 채점 시 오답(미응답)으로 처리됩니다.
          </p>
        )}
        <Button
          size="lg"
          onClick={onSubmit}
          className="w-full gap-2 text-base font-semibold h-12 shadow-sm"
        >
          <CheckCircle2 className="size-5" aria-hidden />
          채점하기
        </Button>
      </div>
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
  const isAnswered = value.trim().length > 0

  return (
    <Card
      className={cn(
        "border-border/70 shadow-sm transition-all",
        isAnswered ? "ring-1 ring-primary/30" : "",
      )}
    >
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs">
              {index + 1}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "font-semibold px-2.5 py-0.5",
                isConcept
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
              )}
            >
              {question.category}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
              {question.kind === "multiple" ? "객관식" : "주관식"}
            </Badge>
          </div>
          {isAnswered && (
            <span className="text-xs font-medium text-primary flex items-center gap-1">
              <Sparkles className="size-3" /> 작성됨
            </span>
          )}
        </div>
        <p className="text-base font-medium leading-relaxed text-pretty text-foreground pt-1">
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
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-foreground">{option}</span>
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
              placeholder="정답을 입력해 주세요 (단어 또는 핵심 문장)"
              className="h-12 text-base font-medium"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
