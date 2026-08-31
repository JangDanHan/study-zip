"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingSection() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-accent">
            <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-foreground">조금만 기다려주세요.</p>
          <p className="text-sm text-muted-foreground">
            학습 내용을 분석해 문제를 만들고 있어요.
          </p>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          퀴즈를 생성하는 중입니다.
        </span>
      </CardContent>
    </Card>
  )
}
