"use client"

import { useEffect, useRef } from "react"
import { AlertCircle, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { QuizType } from "@/lib/quiz-data"

export const MIN_TEXT_LENGTH = 100
export const MAX_TEXT_LENGTH = 3000

const TYPE_OPTIONS: { value: QuizType; label: string; hint: string }[] = [
  { value: "multiple", label: "객관식", hint: "4지선다 5문제" },
  { value: "short", label: "주관식", hint: "단답/서술 5문제" },
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
  autoFocusTrigger?: number
}

export function InputSection({
  text,
  onTextChange,
  quizType,
  onQuizTypeChange,
  error,
  onGenerate,
  disabled,
  autoFocusTrigger,
}: InputSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount = text.length
  const isTooShort = text.trim().length > 0 && text.trim().length < MIN_TEXT_LENGTH
  const isTooLong = charCount > MAX_TEXT_LENGTH

  // Focus textarea whenever autoFocusTrigger changes
  useEffect(() => {
    if (autoFocusTrigger && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocusTrigger])

  return (
    <Card className="border-border/70 shadow-sm transition-all">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-7">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="study-text" className="text-sm font-semibold text-foreground">
              학습 내용
            </Label>
            <span
              className={cn(
                "text-xs font-mono transition-colors",
                isTooLong
                  ? "text-destructive font-bold"
                  : isTooShort
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground",
              )}
            >
              {charCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}자
              {charCount > 0 && charCount < MIN_TEXT_LENGTH && (
                <span className="ml-1 text-[11px] text-muted-foreground">
                  (최소 {MIN_TEXT_LENGTH}자 권장)
                </span>
              )}
            </span>
          </div>

          <Textarea
            ref={textareaRef}
            id="study-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="공부한 내용을 붙여넣어 주세요 (기본개념과 응용 문제를 생성하기 위해 100자 이상 입력을 권장합니다)"
            aria-invalid={!!error}
            aria-describedby={error ? "input-error" : undefined}
            disabled={disabled}
            className={cn(
              "min-h-48 resize-y text-base leading-relaxed transition-colors",
              error
                ? "border-destructive focus-visible:ring-destructive/30"
                : isTooLong
                  ? "border-destructive"
                  : "",
            )}
          />

          {error ? (
            <p
              id="input-error"
              role="alert"
              aria-live="polite"
              className="flex items-center gap-1.5 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <HelpCircle className="size-3.5 shrink-0" aria-hidden />
              문단, 강의 필기, 요약 등 어떤 형태의 학습 텍스트도 가능해요. (100자 ~ 3,000자)
            </p>
          )}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-foreground">문제 유형 선택</legend>
          <div
            role="radiogroup"
            aria-label="문제 유형 선택"
            className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
          >
            {TYPE_OPTIONS.map((option) => {
              const selected = quizType === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => onQuizTypeChange(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50",
                    disabled && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-bold">{option.label}</span>
                    <span
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        selected ? "bg-primary" : "bg-transparent",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      selected ? "text-primary font-medium" : "text-muted-foreground",
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
          disabled={disabled}
          className="w-full gap-2 text-base font-semibold shadow-sm h-12"
        >
          <Sparkles className="size-4" aria-hidden />
          퀴즈 생성
        </Button>
      </CardContent>
    </Card>
  )
}

