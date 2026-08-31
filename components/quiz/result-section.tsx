"use client"

import { Check, HelpCircle, RotateCcw, X, XCircle } from "lucide-react"
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

/**
 * Normalizes text for semantic/flexible matching (removes spaces, special characters, common Korean particles)
 */
function normalizeKoreanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w가-힣]/g, "")
    .replace(/(은|는|이|가|을|를|의|과|와|으로|로|이다|입니다|함|임)$/, "")
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
        ? `${String.fromCharCode(65 + chosen)}. ${question.options[chosen] || "선택된 보기"}`
        : "",
      correctLabel: `${String.fromCharCode(65 + question.answerIndex)}. ${
        question.options[question.answerIndex]
      }`,
    }
  }

  // Short answer grading
  if (!answered) {
    return {
      question,
      answered: false,
      correct: false,
      userAnswerLabel: "",
      correctLabel: question.answerLabel || question.answers?.[0] || "",
    }
  }

  const normalizedUser = normalizeKoreanText(value)
  const isMatch = question.answers.some((candidate) => {
    const normCandidate = normalizeKoreanText(candidate)
    if (!normCandidate || !normalizedUser) return false
    return (
      normCandidate === normalizedUser ||
      normalizedUser.includes(normCandidate) ||
      (normCandidate.length >= 2 && normalizedUser.length >= 2 && normCandidate.includes(normalizedUser))
    )
  })

  return {
    question,
    answered: true,
    correct: isMatch,
    userAnswerLabel: value,
    correctLabel: question.answerLabel || question.answers[0],
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
    <div className="flex flex-col gap-5">
      <ScoreSummary correctCount={correctCount} total={total} percentage={percentage} />

      <div className="flex flex-col gap-4">
        {graded.map((result, index) => (
          <ResultCard key={result.question.id} result={result} index={index} />
        ))}
      </div>

      <Button
        size="lg"
        variant="default"
        onClick={onRestart}
        className="mt-2 w-full gap-2 text-base font-semibold h-12 shadow-sm"
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
    <Card className="border-border/70 shadow-sm overflow-hidden bg-card/80 backdrop-blur-xs">
      <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between sm:p-8">
        <div className="flex flex-col items-center gap-1.5 sm:items-start text-center sm:text-left">
          <Badge variant="secondary" className="font-semibold mb-1">
            채점 완료
          </Badge>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {total}문제 중 <span className="text-primary">{correctCount}문제</span> 정답
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {percentage === 100
              ? "완벽해요! 핵심 개념과 응용 원리를 완전히 마스터하셨습니다. 🎉"
              : percentage >= 80
                ? "훌륭해요! 대부분의 개념을 잘 이해하고 계십니다."
                : percentage >= 60
                  ? "좋아요! 틀린 문제의 해설을 확인하고 보완해 보세요."
                  : "해설을 꼼꼼히 복습한 후 다시 한 번 퀴즈를 생성해 보세요."}
          </p>
        </div>

        <div className="relative flex size-28 shrink-0 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-muted/40"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              className={cn(
                "transition-[stroke-dashoffset] duration-700 ease-out",
                percentage >= 80
                  ? "text-primary"
                  : percentage >= 50
                    ? "text-amber-500"
                    : "text-destructive",
              )}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground font-mono">{percentage}%</span>
            <span className="text-[11px] font-medium text-muted-foreground">정답률</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ResultCard({ result, index }: { result: GradedResult; index: number }) {
  const { question, correct, answered, userAnswerLabel, correctLabel } = result
  const isConcept = question.category === "기본개념"

  return (
    <Card
      className={cn(
        "border-l-4 shadow-sm transition-all",
        correct
          ? "border-l-green-600 dark:border-l-green-500 border-border/70"
          : "border-l-red-600 dark:border-l-red-500 border-border/70",
      )}
    >
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
              {index + 1}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "font-semibold",
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
            {!answered && (
              <Badge
                variant="destructive"
                className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold"
              >
                미응답
              </Badge>
            )}
          </div>
          <StatusIcon correct={correct} />
        </div>
        <p className="text-base font-semibold leading-relaxed text-pretty text-foreground pt-1">
          {question.prompt}
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5 pt-4">
        {/* User Answer */}
        <div
          className={cn(
            "flex flex-col gap-1 rounded-xl px-4 py-3",
            correct
              ? "bg-green-500/10 dark:bg-green-950/30 text-green-700 dark:text-green-300"
              : answered
                ? "bg-red-500/10 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                : "bg-muted/70 text-muted-foreground",
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">내 제출 답안</span>
          <span className="text-sm font-semibold">
            {answered ? userAnswerLabel : "응답하지 않았어요 (미응답 오답 처리)"}
          </span>
        </div>

        {/* Correct Answer if incorrect */}
        {!correct && (
          <div className="flex flex-col gap-1 rounded-xl bg-green-500/10 dark:bg-green-950/30 px-4 py-3 border border-green-500/20">
            <span className="text-xs font-medium text-green-600 dark:text-green-400">정답</span>
            <span className="text-sm font-bold text-green-700 dark:text-green-300">{correctLabel}</span>
          </div>
        )}

        {/* Explanation */}
        <div className="flex flex-col gap-1.5 rounded-xl bg-card border border-border/60 p-4">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <HelpCircle className="size-3.5 text-primary" />
            <span>해설</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
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
        "flex size-8 shrink-0 items-center justify-center rounded-full font-bold shadow-xs",
        correct
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white",
      )}
    >
      {correct ? (
        <Check className="size-5 stroke-[2.5]" aria-label="정답" />
      ) : (
        <X className="size-5 stroke-[2.5]" aria-label="오답" />
      )}
    </span>
  )
}
