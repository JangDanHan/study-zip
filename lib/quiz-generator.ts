import type { Question, QuestionCategory, QuizType, MultipleChoiceQuestion, ShortAnswerQuestion } from "./quiz-data"

export interface GenerateQuizRequest {
  text: string
  quizType: QuizType
}

export interface GenerateQuizResponse {
  success: boolean
  questions?: Question[]
  error?: string
}

/**
 * Heuristic generator that dynamically creates 5 questions from user's study text
 * Used when no LLM API key is present or as a resilient fallback.
 */
export function generateHeuristicQuizFromText(text: string, quizType: QuizType): Question[] {
  const cleanText = text.trim()
  const sentences = cleanText
    .split(/(?<=[.?!~。\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 10)

  const words = cleanText
    .replace(/[^\w가-힣\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["그리고", "하지만", "또한", "따라서", "때문에", "이것은", "그것은"].includes(w))

  const uniqueWords = Array.from(new Set(words))
  const keyTerms = uniqueWords.slice(0, 10)

  const primaryTerm = keyTerms[0] || "핵심 개념"
  const secondaryTerm = keyTerms[1] || "원리와 구조"
  const thirdTerm = keyTerms[2] || "실제 적용"

  const s1 = sentences[0] || cleanText.slice(0, 80)
  const s2 = sentences[1] || sentences[0] || cleanText.slice(80, 160)

  const questions: Question[] = []

  // Question 1 (기본개념)
  if (quizType === "short") {
    questions.push({
      id: 1,
      category: "기본개념",
      kind: "short",
      prompt: `학습한 내용에서 가장 핵심적으로 다루는 '${primaryTerm}'(와) 관련된 중심 개념이나 정의는 무엇인가요?`,
      answers: [primaryTerm, primaryTerm.toLowerCase(), s1.slice(0, 20)],
      answerLabel: primaryTerm,
      explanation: `본문 첫머리 및 주요 내용: "${s1.slice(0, 120)}..." 에서 ${primaryTerm}의 기본 정의를 확인할 수 있습니다.`,
    })
  } else {
    questions.push({
      id: 1,
      category: "기본개념",
      kind: "multiple",
      prompt: `학습한 본문의 핵심 내용("${s1.slice(0, 60)}...")에 대한 설명으로 가장 적절한 것은 무엇인가요?`,
      options: [
        `${primaryTerm}은(는) 전체 맥락에서 핵심적인 역할을 담당한다.`,
        `${primaryTerm}은(는) 본문의 내용과 무관한 부차적인 요소에 불과하다.`,
        `본문에서는 ${primaryTerm}에 대한 어떠한 설명도 제시되지 않았다.`,
        `해당 개념은 실제 상황에서는 전혀 적용될 수 없다.`,
      ],
      answerIndex: 0,
      explanation: `본문: "${s1.slice(0, 120)}..."\n제시된 학습 내용에 따르면 ${primaryTerm}의 올바른 원리와 정의를 파악하는 것이 중요합니다.`,
    })
  }

  // Question 2 (기본개념)
  if (quizType === "multiple") {
    questions.push({
      id: 2,
      category: "기본개념",
      kind: "multiple",
      prompt: `본문에서 언급된 '${secondaryTerm}' 및 주요 특징에 대한 설명으로 옳지 않은 것은?`,
      options: [
        `학습 내용의 전제 조건과 일관된 규칙을 따른다.`,
        `논리적인 원인과 결과의 연결 관계를 가진다.`,
        `근거 없는 임의의 추측만으로 모든 결과를 도출한다.`,
        `체계적인 구조 안에서 상호작용한다.`,
      ],
      answerIndex: 2,
      explanation: `기본 개념과 원리는 항상 타당한 근거와 논리적 인과관계를 기반으로 작동하므로, 임의의 추측에 의존한다는 설명은 옳지 않습니다.`,
    })
  } else {
    questions.push({
      id: 2,
      category: "기본개념",
      kind: "short",
      prompt: `학습 내용 중 '${secondaryTerm}'과(와) 연관된 핵심 속성이나 원리를 가리키는 용어를 적어주세요.`,
      answers: [secondaryTerm, secondaryTerm.toLowerCase(), "인과관계", "체계"],
      answerLabel: secondaryTerm,
      explanation: `학습 텍스트의 중심 구조를 형성하는 핵심 키워드는 '${secondaryTerm}'입니다.`,
    })
  }

  // Question 3 (응용)
  if (quizType === "short") {
    questions.push({
      id: 3,
      category: "응용",
      kind: "short",
      prompt: `학습한 '${primaryTerm}' 개념을 새로운 실제 상황이나 문제에 적용할 때, 가장 우선적으로 확인해야 하는 요소는 무엇인가요?`,
      answers: ["조건", "전제", "제약사항", "환경", "조건과 제약"],
      answerLabel: "조건 (전제 조건)",
      explanation: `응용 문제를 해결할 때는 먼저 주어진 상황의 전제 조건과 제약 사항을 명확히 분석해야 올바른 해답을 도출할 수 있습니다.`,
    })
  } else {
    questions.push({
      id: 3,
      category: "응용",
      kind: "multiple",
      prompt: `본문의 원리("${s2.slice(0, 60)}...")를 실제 문제 상황에 올바르게 적용한 사례는?`,
      options: [
        `주어진 제약 조건과 규칙을 먼저 명확히 분석한 후 단계별로 접근한다.`,
        `본문의 기본 원리를 무시하고 직관적인 감으로만 결론을 내린다.`,
        `문제의 배경이나 전제 조건을 전혀 고려하지 않고 공식을 맹목적으로 대입한다.`,
        `예외 상황이 발생하면 분석을 중단하고 이전 풀이를 전부 건너뛴다.`,
      ],
      answerIndex: 0,
      explanation: `응용의 기본은 본문에서 다룬 원리를 바탕으로 주어진 제약 조건과 맥락을 충실히 반영하여 해결하는 것입니다.`,
    })
  }

  // Question 4 (응용)
  if (quizType === "multiple" || quizType === "mixed") {
    questions.push({
      id: 4,
      category: "응용",
      kind: "multiple",
      prompt: `만약 학습한 내용의 핵심 조건이나 환경('${thirdTerm}')이 변경될 경우 예상되는 결과로 가장 타당한 것은?`,
      options: [
        `결과에 미치는 영향이 없으므로 기존 방식을 그대로 고수해야 한다.`,
        `변경된 변수와 조건에 맞춰 분석 기준과 적용 방식을 유연하게 조정해야 한다.`,
        `원리가 완전히 무효화되므로 개념 전체를 처음부터 다시 정의해야만 한다.`,
        `아무런 사전 검증 없이 임의의 예측값만 선택한다.`,
      ],
      answerIndex: 1,
      explanation: `조건이나 환경이 변화했을 때는 변경된 변수를 파악하여 개념의 적용 방식을 상황에 맞게 조정하는 응용력이 필요합니다.`,
    })
  } else {
    questions.push({
      id: 4,
      category: "응용",
      kind: "short",
      prompt: `특정 사례에서 도출된 '${primaryTerm}'의 원리를 더 넓은 상황에 확장하여 적용하는 사고 과정을 무엇이라고 하나요?`,
      answers: ["일반화", "확장", "추상화", "응용"],
      answerLabel: "일반화 (Generalization)",
      explanation: `개별 사례의 규칙을 보다 보편적인 규칙으로 확대 적용하는 논리적 과정을 '일반화'라고 합니다.`,
    })
  }

  // Question 5 (응용)
  if (quizType === "short") {
    questions.push({
      id: 5,
      category: "응용",
      kind: "short",
      prompt: `학습 내용을 바탕으로 도출한 결과나 풀이가 올바른지 최종 검증하고 오류를 방지하는 과정을 무엇이라 하나요?`,
      answers: ["검산", "검토", "피드백", "검증", "재확인"],
      answerLabel: "검증 (검토/검산)",
      explanation: `응용 문제 해결 후 결과의 논리적 무결성을 점검하고 실수를 바로잡는 검증(검토) 단계는 필수적입니다.`,
    })
  } else {
    questions.push({
      id: 5,
      category: "응용",
      kind: "multiple",
      prompt: `학습한 내용을 토대로 복합적인 문제를 해결한 후, 결과의 타당성을 검증하는 가장 올바른 방법은?`,
      options: [
        `최초의 전제 조건, 계산 과정, 최종 결론이 논리적으로 일치하는지 재검토한다.`,
        `정답이 그럴듯해 보이면 추가 검토 없이 즉시 종료한다.`,
        `오류가 발견되더라도 문제의 조건을 임의로 수정하여 맞춘다.`,
        `다른 조건과의 연계성을 확인하지 않고 단편적인 수치만 비교한다.`,
      ],
      answerIndex: 0,
      explanation: `응용 문제의 최종 단계에서는 전제부터 결론까지의 논리적 일관성과 조건 충족 여부를 꼼꼼히 검증해야 합니다.`,
    })
  }

  return questions
}

/**
 * Calls Gemini API with strict schema enforcement
 */
async function callGeminiAPI(text: string, quizType: QuizType, apiKey: string): Promise<Question[]> {
  let typeConstraint = ""
  if (quizType === "multiple") {
    typeConstraint = "5문제 모두 반드시 kind=\"multiple\" (선택지 options는 정확히 4개의 문자열, answerIndex는 정답 인덱스 0~3 정수)여야 합니다."
  } else if (quizType === "short") {
    typeConstraint = "5문제 모두 반드시 kind=\"short\" (answers는 정답으로 인정할 문자열 배열, answerLabel은 모범 정답 문자열)여야 합니다."
  } else {
    typeConstraint = "5문제 중 문제 1, 3, 5번은 kind=\"multiple\"(4지선다, answerIndex 0~3), 문제 2, 4번은 kind=\"short\"(answers 배열, answerLabel)로 혼합하여 생성하세요."
  }

  const prompt = `
당신은 대한민국 최고 수준의 학습 평가 전문가입니다.
사용자가 입력한 학습 내용을 철저히 분석하여 핵심 이해도를 점검할 수 있는 퀴즈 정확히 5문제를 생성하세요.

[출제 규칙]
1. 문제 수는 반드시 정확히 5문제입니다.
2. 문제 1, 2번: category="기본개념" (학습 텍스트의 핵심 정의, 기본 원리, 핵심 개념)
3. 문제 3, 4, 5번: category="응용" (실무/실생활 시나리오 적용, 조건 변화 시 대처, 인과 분석)
4. 유형 규칙: ${typeConstraint}
5. 모든 문제에는 왜 정답인지 본문에 근거하여 자세하고 친절하게 설명하는 explanation(해설)을 반드시 작성하세요.

[입력 학습 텍스트]
${text}

반드시 아래 형식의 유효한 JSON 문자열로만 응답하세요:
{
  "questions": [
    {
      "id": 1,
      "category": "기본개념",
      "kind": "${quizType === "short" ? "short" : "multiple"}",
      "prompt": "질문 텍스트",
      ${quizType === "short" ? '"answers": ["정답1", "정답2"], "answerLabel": "대표 정답",' : '"options": ["선택지1", "선택지2", "선택지3", "선택지4"], "answerIndex": 0,'}
      "explanation": "상세 해설"
    }
  ]
}
`

  const modelName = "gemini-3.6-flash"
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
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

  if (!response.ok) {
    const errBody = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errBody}`)
  }

  const data = await response.json()
  const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawJsonText) {
    throw new Error("Empty response from Gemini API")
  }

  const parsed = JSON.parse(rawJsonText)
  const rawQuestions: any[] = parsed.questions || parsed

  if (!Array.isArray(rawQuestions) || rawQuestions.length !== 5) {
    throw new Error(`Invalid questions count: ${rawQuestions?.length}`)
  }

  // Schema normalization and validation
  return rawQuestions.map((q, idx) => {
    const category: QuestionCategory = idx < 2 ? "기본개념" : "응용"
    const targetKind =
      quizType === "multiple"
        ? "multiple"
        : quizType === "short"
          ? "short"
          : idx % 2 === 0
            ? "multiple"
            : "short"

    if (targetKind === "multiple") {
      const options = Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ["핵심 개념에 부합한다", "기본 원리와 상충된다", "본문과 무관하다", "적용할 수 없다"]
      const answerIndex = typeof q.answerIndex === "number" && q.answerIndex >= 0 && q.answerIndex <= 3
        ? q.answerIndex
        : 0
      return {
        id: idx + 1,
        category,
        kind: "multiple",
        prompt: q.prompt || `${idx + 1}번 문제입니다.`,
        options,
        answerIndex,
        explanation: q.explanation || "제시된 학습 내용에 근거한 정답입니다.",
      } as MultipleChoiceQuestion
    } else {
      const answers = Array.isArray(q.answers) && q.answers.length > 0
        ? q.answers
        : [q.answerLabel || "정답"]
      const answerLabel = q.answerLabel || answers[0]
      return {
        id: idx + 1,
        category,
        kind: "short",
        prompt: q.prompt || `${idx + 1}번 문제입니다.`,
        answers,
        answerLabel,
        explanation: q.explanation || "제시된 학습 내용에 근거한 정답입니다.",
      } as ShortAnswerQuestion
    }
  })
}

/**
 * Main quiz generation orchestrator
 */
export async function generateQuiz(text: string, quizType: QuizType): Promise<Question[]> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (geminiKey) {
    try {
      return await callGeminiAPI(text, quizType, geminiKey)
    } catch (err) {
      console.warn("LLM API failed, falling back to heuristic generator:", err)
      return generateHeuristicQuizFromText(text, quizType)
    }
  }

  // Fallback heuristic generator
  return generateHeuristicQuizFromText(text, quizType)
}
