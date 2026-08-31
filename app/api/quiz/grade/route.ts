import { NextResponse } from "next/server"
import type { Question } from "@/lib/quiz-data"

export const dynamic = "force-dynamic"
export const maxDuration = 30

interface GradeRequest {
  questions: Question[]
  answers: Record<number, string>
}

interface GradedItem {
  questionId: number
  correct: boolean
  userAnswerLabel: string
  correctLabel: string
  answered: boolean
  feedback?: string
}

function normalizeKoreanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w가-힣]/g, "")
    .replace(/(은|는|이|가|을|를|의|과|와|으로|로|이다|입니다|함|임)$/, "")
}

/**
 * Evaluates subjective short-answer questions using Gemini AI if available
 */
async function evaluateWithGemini(
  question: Question,
  userAnswer: string,
  apiKey: string,
): Promise<{ isCorrect: boolean; feedback?: string }> {
  try {
    const prompt = `
당신은 학습 평가 및 첨삭 지도 전문가입니다.
아래 주관식 문제에 대한 사용자의 답안이 출제 의도와 핵심 의미를 올바르게 포함하고 있는지 판별하고, 1줄 피드백을 제공해주세요.

[문제]
${question.prompt}

[모범 정답]
${(question as any).answerLabel || (question as any).answers?.join(", ")}

[사용자 답안]
${userAnswer}

[해설 배경]
${question.explanation}

반드시 아래 JSON 포맷으로만 응답하세요:
{
  "isCorrect": true,
  "feedback": "핵심 개념을 정확히 이해하고 서술하셨습니다."
}
`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      },
    )

    if (!res.ok) throw new Error("Gemini grading failed")
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    const parsed = JSON.parse(text)
    return {
      isCorrect: Boolean(parsed.isCorrect),
      feedback: parsed.feedback || undefined,
    }
  } catch (err) {
    // Fallback to local heuristic
    const normUser = normalizeKoreanText(userAnswer)
    const answers = (question as any).answers || []
    const isMatch = answers.some((a: string) => {
      const normA = normalizeKoreanText(a)
      return normA === normUser || normUser.includes(normA) || normA.includes(normUser)
    })
    return { isCorrect: isMatch }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GradeRequest
    const { questions, answers = {} } = body

    if (!Array.isArray(questions)) {
      return NextResponse.json({ success: false, error: "Invalid questions" }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const results: GradedItem[] = []

    for (const q of questions) {
      const raw = (answers[q.id] ?? "").trim()
      const answered = raw !== ""

      if (q.kind === "multiple") {
        const chosen = raw === "" ? -1 : Number(raw)
        const correct = answered && chosen === q.answerIndex
        results.push({
          questionId: q.id,
          answered,
          correct,
          userAnswerLabel: answered ? `${String.fromCharCode(65 + chosen)}. ${q.options[chosen] || ""}` : "",
          correctLabel: `${String.fromCharCode(65 + q.answerIndex)}. ${q.options[q.answerIndex]}`,
        })
      } else {
        // Short answer
        if (!answered) {
          results.push({
            questionId: q.id,
            answered: false,
            correct: false,
            userAnswerLabel: "",
            correctLabel: (q as any).answerLabel || (q as any).answers?.[0] || "",
          })
        } else if (geminiKey) {
          const aiEval = await evaluateWithGemini(q, raw, geminiKey)
          results.push({
            questionId: q.id,
            answered: true,
            correct: aiEval.isCorrect,
            userAnswerLabel: raw,
            correctLabel: (q as any).answerLabel || (q as any).answers?.[0] || "",
            feedback: aiEval.feedback,
          })
        } else {
          // Heuristic fallback
          const normUser = normalizeKoreanText(raw)
          const isMatch = (q as any).answers?.some((cand: string) => {
            const normCand = normalizeKoreanText(cand)
            return normCand === normUser || normUser.includes(normCand) || (cand.length >= 2 && normCand.includes(normUser))
          })
          results.push({
            questionId: q.id,
            answered: true,
            correct: Boolean(isMatch),
            userAnswerLabel: raw,
            correctLabel: (q as any).answerLabel || (q as any).answers?.[0] || "",
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Grading error:", error)
    return NextResponse.json({ success: false, error: "Grading failed" }, { status: 500 })
  }
}
