"use client"

import { useEffect, useRef } from "react"
import { AlertCircle, BookOpen, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { QuizType } from "@/lib/quiz-data"

export const MIN_TEXT_LENGTH = 100
export const MAX_TEXT_LENGTH = 3000

export const PRESET_EXAMPLES = [
  {
    category: "IT/CS",
    label: "HTTP & HTTPS 프로토콜",
    text: "HTTP(HyperText Transfer Protocol)는 웹 브라우저와 웹 서버 간의 통신을 위한 애플리케이션 계층 프로토콜입니다. 무상태(Stateless)와 비연결성(Connectionless)이라는 특징을 가지며, 쿠키와 세션을 통해 이전 상태를 유지할 수 있습니다. HTTPS는 SSL/TLS 암호화를 추가하여 데이터의 기밀성과 무결성을 보장하며 기본 포트로 443을 사용합니다.",
  },
  {
    category: "역사",
    label: "훈민정음 창제와 원리",
    text: "조선 제4대 왕 세종은 1443년 백성들이 자신의 뜻을 쉽게 표현할 수 있도록 훈민정음(한글) 28자를 창제하였습니다. 발음 기관의 모양을 본떠 자음을 만들고 천지인(天地人) 삼재의 원리를 바탕으로 모음을 구성하여 과학적이고 독창적인 문자 체계를 완성했습니다. 집현전 학사들과 함께 1446년 훈민정음 해례본을 반포하였습니다.",
  },
  {
    category: "경제",
    label: "시장 균형과 탄력성",
    text: "시장 경제에서 균형 가격은 수요량과 공급량이 일치하는 지점에서 결정됩니다. 수요의 가격 탄력성은 가격 변동에 따른 수요량의 민감도를 측정하며, 대체재가 많거나 사치품일수록 탄력성이 높고 필수재일수록 비탄력적입니다. 공급이 제한된 상태에서 수요가 급증하면 초과 수요로 인해 가격 상승 압력이 발생합니다.",
  },
  {
    category: "물리",
    label: "뉴턴의 운동 3법칙",
    text: "뉴턴의 운동 제1법칙(관성의 법칙)은 물체에 외력이 작용하지 않으면 정지한 물체는 계속 정지하고 운동하는 물체는 등속 직선 운동을 유지한다는 법칙입니다. 제2법칙(가속도의 법칙)은 힘이 질량과 가속도의 곱에 비례함(F=ma)을 나타내며, 제3법칙(작용과 반작용의 법칙)은 모든 작용에는 크기가 같고 방향이 반대인 반작용이 항상 존재함을 의미합니다.",
  },
]

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

  useEffect(() => {
    if (autoFocusTrigger && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocusTrigger])

  function handleSelectPreset(presetText: string) {
    onTextChange(presetText)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="brutal-card p-5 sm:p-7 flex flex-col gap-6 bg-[#ffffff]">
      {/* Preset quick buttons */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1a1a1a]">
          <span className="bg-[#1a1a1a] text-[#ffcc00] px-1.5 py-0.5 text-[10px] font-mono">QUICK</span>
          <span>원클릭 예시 텍스트 불러오기</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={disabled}
              onClick={() => handleSelectPreset(preset.text)}
              className="border-2 border-[#1a1a1a] bg-[#f5f0e8] px-2.5 py-2 text-left text-xs font-bold text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-[#ffcc00] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 flex flex-col gap-0.5 shadow-[2px_2px_0px_#1a1a1a]"
            >
              <span className="text-[10px] font-mono font-black uppercase text-[#0055ff] group-hover:text-[#ffcc00]">
                {preset.category}
              </span>
              <span className="truncate font-black">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="study-text" className="text-sm font-black uppercase text-[#1a1a1a]">
            학습 내용 입력
          </Label>
          <span
            className={cn(
              "text-xs font-mono font-bold px-2 py-0.5 border border-[#1a1a1a]",
              isTooLong
                ? "bg-[#e63b2e] text-white"
                : isTooShort
                  ? "bg-[#ffcc00] text-[#1a1a1a]"
                  : "bg-[#f5f0e8] text-[#1a1a1a]",
            )}
          >
            {charCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}자
          </span>
        </div>

        <Textarea
          ref={textareaRef}
          id="study-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="공부한 내용을 붙여넣어 주세요 (100자 ~ 3,000자 / 위 예시 버튼 클릭 가능)"
          aria-invalid={!!error}
          aria-describedby={error ? "input-error" : undefined}
          disabled={disabled}
          className={cn(
            "min-h-48 rounded-none border-[2.5px] border-[#1a1a1a] bg-[#ffffff] p-3.5 text-base leading-relaxed text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 shadow-[4px_4px_0px_#1a1a1a] focus:outline-none focus:ring-0 focus:border-[#0055ff]",
            error && "border-[#e63b2e] bg-red-50/20",
          )}
        />

        {error ? (
          <p
            id="input-error"
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1.5 text-sm font-bold text-[#e63b2e] border-2 border-[#e63b2e] bg-red-50 px-3 py-1.5"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {error}
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#1a1a1a]/70">
            <HelpCircle className="size-3.5 shrink-0 text-[#0055ff]" aria-hidden />
            문단, 강의 필기, 요약 등 어떤 형태의 학습 텍스트도 가능해요. (100자 ~ 3,000자)
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-black uppercase text-[#1a1a1a]">문제 유형 선택</legend>
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
                  "flex flex-col items-start gap-1 p-3.5 text-left border-[2.5px] border-[#1a1a1a] transition-all",
                  selected
                    ? "bg-[#ffcc00] text-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a]"
                    : "bg-[#ffffff] text-[#1a1a1a] hover:bg-[#f5f0e8]",
                  disabled && "opacity-60 cursor-not-allowed",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-display text-sm font-black uppercase">{option.label}</span>
                  <span
                    className={cn(
                      "size-3 border-2 border-[#1a1a1a] transition-colors",
                      selected ? "bg-[#1a1a1a]" : "bg-white",
                    )}
                  />
                </div>
                <span className="text-xs font-bold text-[#1a1a1a]/80">
                  {option.hint}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled}
        className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] w-full py-4 text-base sm:text-lg font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ffcc00] transition-colors disabled:opacity-50"
      >
        <Sparkles className="size-5" aria-hidden />
        AI 퀴즈 생성
      </button>
    </div>
  )
}
