"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
      <Card className="border-destructive/40 bg-destructive/5 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" aria-hidden />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <p className="text-base font-semibold text-destructive">
              {isTimeout ? "응답이 지연되고 있습니다" : "문제 생성 실패"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error}
            </p>
          </div>
          {onRetry && (
            <Button
              variant="default"
              size="default"
              onClick={onRetry}
              className="mt-2 gap-2 font-medium"
            >
              <RotateCcw className="size-4" aria-hidden />
              다시 시도
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 duration-1000" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-foreground">조금만 기다려주세요.</p>
          <p className="text-sm text-muted-foreground">
            학습 내용을 정밀 분석하여 기본개념 2문제 + 응용 3문제를 만들고 있어요.
          </p>
          {seconds >= 5 && (
            <p className="text-xs text-muted-foreground/80 mt-1 font-mono">
              생성 중... ({seconds}초 경과)
            </p>
          )}
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          퀴즈를 생성하는 중입니다.
        </span>
      </CardContent>
    </Card>
  )
}
