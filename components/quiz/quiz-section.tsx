"use client"

import { CheckCircle2, FileQuestion, Sparkles } from "lucide-react"
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
    <div className="flex flex-col gap-6">
      {/* Progress Card */}
      <div className="brutal-card p-4 sm:p-5 bg-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1a1a1a] text-[#ffcc00] p-1 font-mono text-xs font-black">
              QUIZ
            </span>
            <h2 className="font-display text-base sm:text-lg font-black uppercase text-[#1a1a1a]">
              문제 풀이 진행
            </h2>
          </div>
          <span className="font-mono text-sm font-black text-[#1a1a1a] bg-[#ffcc00] px-2 py-0.5 border-2 border-[#1a1a1a]">
            {answeredCount} / {questions.length} 완료 ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 border-2 border-[#1a1a1a] bg-[#f5f0e8] overflow-hidden">
          <div
            className="h-full bg-[#ffcc00] border-r-2 border-[#1a1a1a] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Cards */}
      <div className="flex flex-col gap-5">
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

      {/* Submit Button Area */}
      <div className="flex flex-col gap-2.5 pt-2">
        {hasUnanswered && (
          <p className="text-center text-xs font-bold text-[#e63b2e] border-2 border-[#e63b2e] bg-red-50 p-2">
            ⚠️ 미응답 문항({questions.length - answeredCount}개)은 채점 시 오답으로 처리됩니다.
          </p>
        )}
        <button
          type="button"
          onClick={onSubmit}
          className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] w-full py-4 text-lg font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
        >
          <CheckCircle2 className="size-6 stroke-[2.5]" aria-hidden />
          <span>채점 및 해설 확인하기</span>
        </button>
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
    <div
      className={cn(
        "brutal-card p-5 sm:p-6 bg-white flex flex-col gap-4 transition-all",
        isAnswered ? "border-[#1a1a1a]" : "",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#1a1a1a] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-display size-7 bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-black">
            Q{index + 1}
          </span>
          <span
            className={cn(
              "text-xs font-black uppercase px-2 py-0.5 border-2 border-[#1a1a1a]",
              isConcept
                ? "bg-[#0055ff] text-white"
                : "bg-[#ffcc00] text-[#1a1a1a]",
            )}
          >
            {question.category}
          </span>
          <span className="text-xs font-mono font-bold bg-[#f5f0e8] px-2 py-0.5 border border-[#1a1a1a]">
            {question.kind === "multiple" ? "객관식" : "주관식"}
          </span>
        </div>
        {isAnswered && (
          <span className="text-xs font-black uppercase text-[#0055ff] flex items-center gap-1">
            <Sparkles className="size-3.5" /> 입력완료
          </span>
        )}
      </div>

      <p className="text-base font-bold leading-relaxed text-[#1a1a1a]">
        {question.prompt}
      </p>

      <div>
        {question.kind === "multiple" ? (
          <div role="radiogroup" aria-label={`${index + 1}번 문제 선택지`} className="flex flex-col gap-2.5">
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
                    "flex items-start gap-3 p-3.5 text-left border-2 border-[#1a1a1a] transition-all",
                    selected
                      ? "bg-[#ffcc00] text-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] font-bold"
                      : "bg-[#ffffff] text-[#1a1a1a] hover:bg-[#f5f0e8]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center border-2 border-[#1a1a1a] text-xs font-black font-display",
                      selected ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a]",
                    )}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`answer-${question.id}`} className="sr-only">
              {index + 1}번 문제 답 입력
            </label>
            <input
              id={`answer-${question.id}`}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="정답을 입력하세요 (단어 또는 문장형 답변 가능)"
              className="w-full border-2 border-[#1a1a1a] bg-white p-3 text-base font-bold text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 shadow-[3px_3px_0px_#1a1a1a] focus:outline-none focus:bg-[#ffcc00]/10"
            />
          </div>
        )}
      </div>
    </div>
  )
}
