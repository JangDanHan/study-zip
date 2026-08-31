"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoadingSectionProps {
  error?: string | null
  onRetry?: () => void
  isTimeout?: boolean
}

export function LoadingSection({ error, onRetry, isTimeout }: LoadingSectionProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (error) return
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [error])

  if (error) {
    return (
      <div className="brutal-card border-[2.5px] border-[#1a1a1a] bg-[#ffffff] p-6 sm:p-8 flex flex-col items-center justify-center gap-4 text-center shadow-[6px_6px_0px_#e63b2e]">
        <div className="size-12 bg-[#e63b2e] border-2 border-[#1a1a1a] flex items-center justify-center text-white">
          <AlertTriangle className="size-6" aria-hidden />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <p className="font-display text-lg font-black uppercase text-[#e63b2e]">
            {isTimeout ? "응답 지연 발생 (30초 초과)" : "퀴즈 생성 실패"}
          </p>
          <p className="text-sm font-bold text-[#1a1a1a]/80 leading-relaxed">
            {error}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] px-6 py-2.5 text-sm font-black uppercase flex items-center gap-2 mt-2 shadow-[3px_3px_0px_#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ffcc00]"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span>다시 시도하기</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="brutal-card border-[2.5px] border-[#1a1a1a] bg-[#ffffff] p-8 sm:p-12 flex flex-col items-center justify-center gap-5 text-center shadow-[6px_6px_0px_#1a1a1a]">
      <div className="relative">
        <div className="size-14 bg-[#ffcc00] border-[2.5px] border-[#1a1a1a] flex items-center justify-center shadow-[4px_4px_0px_#1a1a1a] animate-pulse">
          <Sparkles className="size-7 text-[#1a1a1a]" aria-hidden />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 max-w-md">
        <span className="font-display text-xs font-black uppercase tracking-widest text-[#0055ff]">
          AI ENGINE PROCESSING
        </span>
        <p className="font-display text-xl font-black uppercase text-[#1a1a1a]">
          조금만 기다려주세요.
        </p>
        <p className="text-sm font-medium text-[#1a1a1a]/80 leading-relaxed">
          학습 텍스트를 분석하여 <strong className="text-[#1a1a1a] bg-[#ffcc00] px-1">기본개념 2문제 + 응용 3문제</strong>를 생성하고 있습니다.
        </p>
        {seconds >= 3 && (
          <p className="text-xs font-mono font-bold text-[#1a1a1a]/70 mt-2 bg-[#f5f0e8] border border-[#1a1a1a] px-2.5 py-1 w-fit mx-auto">
            ⏳ 처리 중... ({seconds}초 경과)
          </p>
        )}
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        퀴즈를 생성하는 중입니다.
      </span>
    </div>
  )
}
