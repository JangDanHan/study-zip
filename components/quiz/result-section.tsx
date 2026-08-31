"use client"

import { useState } from "react"
import { Check, Copy, HelpCircle, RotateCcw, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/quiz-data"
import type { AnswerMap } from "./quiz-section"

export interface GradedResult {
  question: Question
  userAnswerLabel: string
  correctLabel: string
  answered: boolean
  correct: boolean
  feedback?: string
}

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
  customGraded?: GradedResult[]
}

export function ResultSection({ questions, answers, onRestart, customGraded }: ResultSectionProps) {
  const [copied, setCopied] = useState(false)
  const graded = customGraded || questions.map((q) => gradeQuestion(q, answers[q.id]))
  const correctCount = graded.filter((g) => g.correct).length
  const total = questions.length
  const percentage = Math.round((correctCount / total) * 100)

  function handleCopyNote() {
    let md = `# 📝 퀴즈 학습 오답노트 (정답률: ${percentage}%)\n\n`
    md += `> **결과**: ${total}문제 중 ${correctCount}문제 정답 (${percentage}%)\n\n---\n\n`

    graded.forEach((item, idx) => {
      const statusIcon = item.correct ? "✅ 정답" : item.answered ? "❌ 오답" : "⚠️ 미응답"
      md += `### [문제 ${idx + 1}] (${item.question.category} · ${item.question.kind === "multiple" ? "객관식" : "주관식"}) - ${statusIcon}\n`
      md += `**질문**: ${item.question.prompt}\n\n`
      md += `- **내 답안**: ${item.answered ? item.userAnswerLabel : "(미응답)"}\n`
      if (!item.correct) {
        md += `- **정답**: ${item.correctLabel}\n`
      }
      if (item.feedback) {
        md += `- **AI 맞춤 피드백**: ${item.feedback}\n`
      }
      md += `- **해설**: ${item.question.explanation}\n\n---\n\n`
    })

    if (navigator.clipboard) {
      navigator.clipboard.writeText(md)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Score Summary Box */}
      <div className="brutal-card p-6 sm:p-8 bg-white border-[2.5px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
          <span className="font-display text-xs font-black uppercase bg-[#1a1a1a] text-[#ffcc00] px-2 py-0.5 tracking-wider">
            EVALUATION REPORT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1a1a1a]">
            {total}문제 중 <span className="bg-[#ffcc00] px-1.5 border-2 border-[#1a1a1a]">{correctCount}문제</span> 정답
          </h2>
          <p className="text-sm font-bold text-[#1a1a1a]/80 max-w-md">
            {percentage === 100
              ? "완벽합니다! 핵심 개념과 응용 원리를 완전히 마스터하셨습니다. 🎉"
              : percentage >= 80
                ? "훌륭합니다! 대부분의 개념을 탄탄하게 이해하고 계십니다."
                : percentage >= 60
                  ? "좋습니다! 오답 문제의 상세 해설을 꼼꼼히 복습해 보세요."
                  : "해설을 확인하고 새로운 퀴즈를 생성하여 다시 도전해 보세요."}
          </p>
        </div>

        <div className="border-[3px] border-[#1a1a1a] bg-[#f5f0e8] p-4 flex flex-col items-center justify-center min-w-32 shadow-[4px_4px_0px_#1a1a1a]">
          <span className="font-display text-4xl font-black text-[#1a1a1a] font-mono">
            {percentage}%
          </span>
          <span className="text-xs font-black uppercase text-[#1a1a1a]/70">SCORE</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display text-lg font-black uppercase text-[#1a1a1a]">
          문제별 채점 결과 & 해설
        </h3>
        <button
          type="button"
          onClick={handleCopyNote}
          className="brutal-btn bg-[#ffffff] text-[#1a1a1a] px-3.5 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
        >
          {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
          <span>{copied ? "복사 완료!" : "오답노트 복사"}</span>
        </button>
      </div>

      {/* Result Cards */}
      <div className="flex flex-col gap-4">
        {graded.map((result, index) => (
          <ResultCard key={result.question.id} result={result} index={index} />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopyNote}
          className="brutal-btn bg-white text-[#1a1a1a] flex-1 py-3.5 text-base font-black uppercase flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
        >
          {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
          <span>{copied ? "클립보드에 복사됨!" : "오답노트 복사 (Markdown)"}</span>
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] flex-1 py-3.5 text-base font-black uppercase flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
        >
          <RotateCcw className="size-5" />
          <span>새 퀴즈 만들기</span>
        </button>
      </div>
    </div>
  )
}

function ResultCard({ result, index }: { result: GradedResult; index: number }) {
  const { question, correct, answered, userAnswerLabel, correctLabel } = result
  const isConcept = question.category === "기본개념"

  return (
    <div
      className={cn(
        "brutal-card p-5 sm:p-6 bg-white border-[2.5px] border-[#1a1a1a] flex flex-col gap-4 shadow-[4px_4px_0px_#1a1a1a]",
        correct ? "border-l-[6px] border-l-[#1a1a1a]" : "border-l-[6px] border-l-[#e63b2e]",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#1a1a1a] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-display size-7 bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-black">
            {index + 1}
          </span>
          <span
            className={cn(
              "text-xs font-black uppercase px-2 py-0.5 border-2 border-[#1a1a1a]",
              isConcept ? "bg-[#0055ff] text-white" : "bg-[#ffcc00] text-[#1a1a1a]",
            )}
          >
            {question.category}
          </span>
          <span className="text-xs font-mono font-bold bg-[#f5f0e8] px-2 py-0.5 border border-[#1a1a1a]">
            {question.kind === "multiple" ? "객관식" : "주관식"}
          </span>
          {!answered && (
            <span className="text-xs font-black uppercase bg-[#e63b2e] text-white px-2 py-0.5 border border-[#1a1a1a]">
              미응답
            </span>
          )}
        </div>
        <span
          className={cn(
            "text-xs font-black uppercase px-2.5 py-1 border-2 border-[#1a1a1a] flex items-center gap-1",
            correct ? "bg-[#ffcc00] text-[#1a1a1a]" : "bg-[#e63b2e] text-white",
          )}
        >
          {correct ? <Check className="size-3.5 stroke-[3]" /> : <X className="size-3.5 stroke-[3]" />}
          <span>{correct ? "정답" : "오답"}</span>
        </span>
      </div>

      <p className="text-base font-bold leading-relaxed text-[#1a1a1a]">
        {question.prompt}
      </p>

      {/* Answer Details */}
      <div className="flex flex-col gap-2.5">
        <div
          className={cn(
            "p-3 border-2 border-[#1a1a1a] flex flex-col gap-0.5",
            correct ? "bg-[#f5f0e8]" : "bg-red-50",
          )}
        >
          <span className="text-[11px] font-black uppercase font-mono text-[#1a1a1a]/70">내 제출 답안</span>
          <span className="text-sm font-bold text-[#1a1a1a]">
            {answered ? userAnswerLabel : "(미응답 오답 처리)"}
          </span>
        </div>

        {!correct && (
          <div className="p-3 border-2 border-[#1a1a1a] bg-[#ffcc00]/20 flex flex-col gap-0.5">
            <span className="text-[11px] font-black uppercase font-mono text-[#1a1a1a]/70">모범 정답</span>
            <span className="text-sm font-black text-[#1a1a1a]">{correctLabel}</span>
          </div>
        )}

        {result.feedback && (
          <div className="p-3 border-2 border-[#1a1a1a] bg-[#0055ff]/10 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#0055ff]">
              <Sparkles className="size-3.5" />
              <span>AI 주관식 1:1 맞춤 첨삭 피드백</span>
            </div>
            <p className="text-sm font-bold text-[#1a1a1a] leading-relaxed">
              {result.feedback}
            </p>
          </div>
        )}

        <div className="p-3.5 border-2 border-[#1a1a1a] bg-[#f5f0e8] flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs font-black uppercase text-[#1a1a1a]">
            <HelpCircle className="size-3.5 text-[#0055ff]" />
            <span>해설</span>
          </div>
          <p className="text-sm text-[#1a1a1a]/85 leading-relaxed whitespace-pre-line font-medium">
            {question.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}
