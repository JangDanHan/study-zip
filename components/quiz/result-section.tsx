"use client"

import { Check, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/quiz-data"
import type { AnswerMap } from "./quiz-section"

interface GradedResult {
  question: Question
  userAnswerLabel: string
  correctLabel: string
  answered: boolean
  correct: boolean
}

function gradeQuestion(question: Question, raw: string | undefined): GradedResult {
  const value = (raw ?? "").trim()
  const answered = value !== ""

  if (question.kind === "multiple") {
    const chosen = value === "" ? -1 : Number(value)
    const correct = chosen === question.answerIndex
    return {
      question,
      answered,
      correct: answered && correct,
      userAnswerLabel: answered
        ? `${String.fromCharCode(65 + chosen)}. ${question.options[chosen]}`
        : "",
      correctLabel: `${String.fromCharCode(65 + question.answerIndex)}. ${
        question.options[question.answerIndex]
      }`,
    }
  }

  const normalized = value.toLowerCase().replace(/\s/g, "")
  const correct = question.answers.some(
    (a) => a.toLowerCase().replace(/\s/g, "") === normalized,
  )
  return {
    question,
    answered,
    correct: answered && correct,
    userAnswerLabel: value,
    correctLabel: question.answerLabel,
  }
}

interface ResultSectionProps {
  questions: Question[]
  answers: AnswerMap
  onRestart: () => void
}

export function ResultSection({ questions, answers, onRestart }: ResultSectionProps) {
  const graded = questions.map((q) => gradeQuestion(q, answers[q.id]))
  const correctCount = graded.filter((g) => g.correct).length
  const total = questions.length
  const percentage = Math.round((correctCount / total) * 100)

  return (
    <div className="flex flex-col gap-4">
      <ScoreSummary correctCount={correctCount} total={total} percentage={percentage} />

      <div className="flex flex-col gap-4">
        {graded.map((result, index) => (
          <ResultCard key={result.question.id} result={result} index={index} />
        ))}
      </div>

      <Button
        size="lg"
        variant="secondary"
        onClick={onRestart}
        className="mt-1 w-full gap-2 text-base"
      >
        <RotateCcw className="size-4" aria-hidden />
        다시 만들기
      </Button>
    </div>
  )
}

function ScoreSummary({
  correctCount,
  total,
  percentage,
}: {
  correctCount: number
  total: number
  percentage: number
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between sm:p-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground">채점 결과</p>
          <p className="text-2xl font-bold text-foreground text-balance">
            {total}문제 중 <span className="text-primary">{correctCount}문제</span> 정답
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 80
              ? "훌륭해요! 개념을 잘 이해하고 있어요."
              : percentage >= 50
                ? "좋아요. 틀린 문제의 해설을 확인해 보세요."
                : "해설을 꼼꼼히 읽고 다시 도전해 보세요."}
          </p>
        </div>

        <div className="relative flex size-28 shrink-0 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">정답률</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultCard({ result, index }: { result: GradedResult; index: number }) {
  const { question, correct, answered, userAnswerLabel, correctLabel } = result

  return (
    <Card
      className={cn(
        "border-l-4 shadow-sm",
        correct
          ? "border-l-success border-border/70"
          : "border-l-destructive border-border/70",
      )}
    >
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {index + 1}
            </span>
            <Badge variant="secondary" className="font-medium">
              {question.category}
            </Badge>
            {!answered && (
              <Badge
                variant="outline"
                className="border-muted-foreground/40 font-medium text-muted-foreground"
              >
                미응답
              </Badge>
            )}
          </div>
          <StatusIcon correct={correct} />
        </div>
        <p className="text-base font-medium leading-relaxed text-pretty text-foreground">
          {question.prompt}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
        <div
          className={cn(
            "flex flex-col gap-1 rounded-lg px-4 py-3",
            correct
              ? "bg-success/10"
              : answered
                ? "bg-destructive/10"
                : "bg-muted",
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">내 답</span>
          <span
            className={cn(
              "text-sm font-medium",
              correct
                ? "text-success"
                : answered
                  ? "text-destructive"
                  : "text-muted-foreground",
            )}
          >
            {answered ? userAnswerLabel : "응답하지 않았어요"}
          </span>
        </div>

        {!correct && (
          <div className="flex flex-col gap-1 rounded-lg bg-success/10 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">정답</span>
            <span className="text-sm font-medium text-success">{correctLabel}</span>
          </div>
        )}

        <div className="flex flex-col gap-1 px-1">
          <span className="text-xs font-semibold text-foreground">해설</span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {question.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusIcon({ correct }: { correct: boolean }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        correct ? "bg-success text-success-foreground" : "bg-destructive text-white",
      )}
    >
      {correct ? (
        <Check className="size-5" aria-label="정답" />
      ) : (
        <X className="size-5" aria-label="오답" />
      )}
    </span>
  )
}
