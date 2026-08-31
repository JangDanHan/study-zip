import { NextResponse } from "next/server"
import { generateQuiz } from "@/lib/quiz-generator"
import type { QuizType } from "@/lib/quiz-data"

export const dynamic = "force-dynamic"
export const maxDuration = 30 // Allow up to 30s timeout

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, quizType = "multiple" } = body as { text?: string; quizType?: QuizType }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "학습 내용을 입력해 주세요" },
        { status: 400 },
      )
    }

    const trimmed = text.trim()
    if (trimmed.length < 100) {
      return NextResponse.json(
        { success: false, error: "학습 내용을 조금 더 길게 써주세요 (최소 100자)" },
        { status: 400 },
      )
    }

    if (trimmed.length > 3000) {
      return NextResponse.json(
        { success: false, error: "입력이 너무 깁니다. 3,000자 이내로 줄여주세요" },
        { status: 400 },
      )
    }

    const validQuizTypes: QuizType[] = ["multiple", "short", "mixed"]
    const targetQuizType = validQuizTypes.includes(quizType) ? quizType : "multiple"

    const questions = await generateQuiz(trimmed, targetQuizType)

    if (!questions || questions.length !== 5) {
      return NextResponse.json(
        { success: false, error: "문제 생성에 실패했습니다. 다시 시도해 주세요" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      questions,
    })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json(
      { success: false, error: "문제 생성에 실패했습니다. 다시 시도해 주세요" },
      { status: 500 },
    )
  }
}
