"use client"

import { useRef, useState } from "react"
import { ArrowLeft, BookOpen, GraduationCap, Sparkles } from "lucide-react"
import { LandingPage } from "@/components/landing/landing-page"
import { InputSection, MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from "@/components/quiz/input-section"
import { LoadingSection } from "@/components/quiz/loading-section"
import { QuizSection, type AnswerMap } from "@/components/quiz/quiz-section"
import { ResultSection, type GradedResult } from "@/components/quiz/result-section"
import type { Question, QuizType } from "@/lib/quiz-data"

type ViewMode = "landing" | "app"
type Phase = "input" | "loading" | "quiz" | "result"

export default function Page() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing")
  const [phase, setPhase] = useState<Phase>("input")
  const [text, setText] = useState("")
  const [quizType, setQuizType] = useState<QuizType>("multiple")
  const [error, setError] = useState<string | null>(null)
  const [autoFocusTrigger, setAutoFocusTrigger] = useState(0)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isTimeout, setIsTimeout] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [customGraded, setCustomGraded] = useState<GradedResult[] | undefined>(undefined)
  const resultRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  function handleStartApp() {
    setViewMode("app")
    window.scrollTo({ top: 0, behavior: "smooth" })
    setAutoFocusTrigger((prev) => prev + 1)
  }

  function handleBackToLanding() {
    setViewMode("landing")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleGenerate() {
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
    setGenerationError(null)
    setIsTimeout(false)
    setPhase("loading")

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    // 30-second timeout handling (PRD 5-4)
    const timeoutId = setTimeout(() => {
      controller.abort()
      setIsTimeout(true)
      setGenerationError("응답이 지연되고 있습니다. 다시 시도해 주세요")
    }, 30000)

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, quizType }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok || !data.success || !Array.isArray(data.questions) || data.questions.length !== 5) {
        throw new Error(data.error || "문제 생성에 실패했습니다. 다시 시도해 주세요")
      }

      setQuestions(data.questions)
      setAnswers({})
      setGenerationError(null)
      setPhase("quiz")
    } catch (err: unknown) {
      clearTimeout(timeoutId)
      const errorObj = err as Error
      if (errorObj?.name === "AbortError" && isTimeout) {
        return
      }
      setGenerationError(errorObj?.message || "문제 생성에 실패했습니다. 다시 시도해 주세요")
    }
  }

  function handleAnswerChange(questionId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmit() {
    setPhase("result")
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)

    try {
      const res = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers }),
      })
      const data = await res.json()
      if (res.ok && data.success && Array.isArray(data.results)) {
        const mapped: GradedResult[] = data.results.map((r: any) => {
          const q = questions.find((item) => item.id === r.questionId) || questions[0]
          return {
            question: q,
            userAnswerLabel: r.userAnswerLabel,
            correctLabel: r.correctLabel,
            answered: r.answered,
            correct: r.correct,
            feedback: r.feedback,
          }
        })
        setCustomGraded(mapped)
      }
    } catch {
      // Fallback to client evaluation
    }
  }

  function handleRestart() {
    setPhase("input")
    setQuestions([])
    setAnswers({})
    setCustomGraded(undefined)
    setError(null)
    setGenerationError(null)
    setIsTimeout(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 1. Landing View
  if (viewMode === "landing") {
    return <LandingPage onStartQuiz={handleStartApp} />
  }

  // 2. Quiz Maker App View
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:py-10 bg-[#f5f0e8] text-[#1a1a1a]">
      {/* App Header */}
      <header className="flex flex-col gap-4 border-b-[2.5px] border-[#1a1a1a] pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToLanding}
            className="brutal-btn bg-white text-[#1a1a1a] px-3 py-1 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
          >
            <ArrowLeft className="size-3.5" />
            <span>홈으로</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-mono font-black uppercase">
              STUDY-ZIP APP
            </span>
            <span className="text-xs font-mono font-bold">v2.0</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center pt-1">
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a1a]">
            학습 확인 퀴즈 생성기
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#1a1a1a]/80">
            공부한 내용을 붙여넣으면 Gemini AI가 이해도 점검 퀴즈 5문제를 생성합니다.
          </p>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-col gap-6">
        <InputSection
          text={text}
          onTextChange={(v) => {
            setText(v)
            if (error) setError(null)
            if (generationError) setGenerationError(null)
          }}
          quizType={quizType}
          onQuizTypeChange={setQuizType}
          error={error}
          onGenerate={handleGenerate}
          disabled={phase === "loading" && !generationError}
          autoFocusTrigger={autoFocusTrigger}
        />

        {phase === "loading" && (
          <div key="loading" className="animate-in fade-in duration-300">
            <LoadingSection
              error={generationError}
              isTimeout={isTimeout}
              onRetry={handleGenerate}
            />
          </div>
        )}

        {phase === "quiz" && (
          <div key="quiz" className="animate-in fade-in duration-300">
            <QuizSection
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {phase === "result" && (
          <div ref={resultRef} key="result" className="animate-in fade-in duration-300">
            <ResultSection
              questions={questions}
              answers={answers}
              customGraded={customGraded}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>

      <footer className="mt-auto pt-6 border-t-2 border-[#1a1a1a] text-center text-xs font-mono font-bold text-[#1a1a1a]/70">
        STUDY-ZIP · FORM FOLLOWS LEARNING · NO LOGIN REQUIRED
      </footer>
    </main>
  )
}
