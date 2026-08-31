"use client"

import { AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { QuizType } from "@/lib/quiz-data"

const TYPE_OPTIONS: { value: QuizType; label: string; hint: string }[] = [
  { value: "multiple", label: "객관식", hint: "4지선다" },
  { value: "short", label: "주관식", hint: "직접 입력" },
  { value: "mixed", label: "혼합", hint: "객관식 + 주관식" },
]

interface InputSectionProps {
  text: string
  onTextChange: (value: string) => void
  quizType: QuizType
  onQuizTypeChange: (value: QuizType) => void
  error: string | null
  onGenerate: () => void
  disabled?: boolean
}

export function InputSection({
  text,
  onTextChange,
  quizType,
  onQuizTypeChange,
  error,
  onGenerate,
  disabled,
}: InputSectionProps) {
  const isEmpty = text.trim().length === 0

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-7">
        <div className="flex flex-col gap-2">
          <Label htmlFor="study-text" className="text-sm font-medium">
            학습 내용
          </Label>
          <Textarea
            id="study-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="공부한 내용을 붙여넣어 주세요"
            aria-invalid={!!error}
            aria-describedby={error ? "input-error" : undefined}
            className={cn(
              "min-h-44 resize-y text-base leading-relaxed",
              error && "border-destructive focus-visible:ring-destructive/30",
            )}
          />
          {error ? (
            <p
              id="input-error"
              role="alert"
              className="flex items-center gap-1.5 text-sm font-medium text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              문단, 필기, 요약 등 어떤 형태의 글도 괜찮아요.
            </p>
          )}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">문제 유형</legend>
          <div
            role="radiogroup"
            aria-label="문제 유형 선택"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {TYPE_OPTIONS.map((option) => {
              const selected = quizType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onQuizTypeChange(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-0.5 rounded-lg border px-4 py-3 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-accent text-accent-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      selected ? "text-accent-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {option.hint}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <Button
          size="lg"
          onClick={onGenerate}
          disabled={isEmpty || disabled}
          className="w-full gap-2 text-base"
        >
          <Sparkles className="size-4" aria-hidden />
          퀴즈 생성
        </Button>
      </CardContent>
    </Card>
  )
}
