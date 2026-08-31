"use client"

import { useRef, useState } from "react"
import { GraduationCap } from "lucide-react"
import { InputSection, MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "@/components/quiz/input-section"
import { LoadingSection } from "@/components/quiz/loading-section"
import { QuizSection, type AnswerMap } from "@/components/quiz/quiz-section"
import { ResultSection } from "@/components/quiz/result-section"
import { generateQuestions, type Question, type QuizType } from "@/lib/quiz-data"

type Phase = "input" | "loading" | "quiz" | "result"

export default function Page() {
  const [phase, setPhase] = useState<Phase>("input")
  const [text, setText] = useState("")
  const [quizType, setQuizType] = useState<QuizType>("multiple")
  const [error, setError] = useState<string | null>(null)
  const [autoFocusTrigger, setAutoFocusTrigger] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerMap>({})
  const resultRef = useRef<HTMLDivElement>(null)

  function handleGenerate() {
    const trimmed = text.trim()
    
    // PRD 5-1: Empty input
    if (trimmed.length === 0) {
      setError("학습 내용을 입력해 주세요")
      setAutoFocusTrigger((prev) => prev + 1)
      return
    }

    // PRD 5-2: Too short (< 100 chars)
    if (trimmed.length < MIN_TEXT_LENGTH) {
      setError(`학습 내용을 조금 더 길게 써주세요 (현재 ${trimmed.length}자 / 최소 ${MIN_TEXT_LENGTH}자)`)
      setAutoFocusTrigger((prev) => prev + 1)
      return
    }

    // PRD 5-3: Too long (> 3000 chars)
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`입력이 너무 깁니다. ${MAX_TEXT_LENGTH.toLocaleString()}자 이내로 줄여주세요 (현재 ${text.length.toLocaleString()}자)`)
      setAutoFocusTrigger((prev) => prev + 1)
      return
    }

    setError(null)
    setPhase("loading")

    // Simulate quiz generation (will be connected to API in Sprint 2)
    window.setTimeout(() => {
      setQuestions(generateQuestions(quizType))
      setAnswers({})
      setPhase("quiz")
    }, 1800)
  }

  function handleAnswerChange(questionId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit() {
    setPhase("result")
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)
  }

  function handleRestart() {
    setPhase("input")
    setText("")
    setQuizType("multiple")
    setQuestions([])
    setAnswers({})
    setError(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            학습 확인 퀴즈 생성기
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
            공부한 내용을 붙여넣으면 이해도를 점검할 수 있는 퀴즈를 만들어드려요.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <InputSection
          text={text}
          onTextChange={(v) => {
            setText(v)
            if (error) setError(null)
          }}
          quizType={quizType}
          onQuizTypeChange={setQuizType}
          error={error}
          onGenerate={handleGenerate}
          disabled={phase === "loading"}
          autoFocusTrigger={autoFocusTrigger}
        />

        {phase === "loading" && (
          <div
            key="loading"
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            <LoadingSection />
          </div>
        )}

        {phase === "quiz" && (
          <div
            key="quiz"
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            <QuizSection
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {phase === "result" && (
          <div
            ref={resultRef}
            key="result"
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            <ResultSection
              questions={questions}
              answers={answers}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>

      <footer className="mt-auto pt-4 text-center text-xs text-muted-foreground">
        입력한 내용은 저장되지 않으며, 이 화면은 데모용 더미 데이터로 동작해요.
      </footer>
    </main>
  )
}
