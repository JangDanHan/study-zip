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
  // Split into sentences and paragraphs
  const sentences = cleanText
    .split(/(?<=[.?!~。\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 10)

  // Extract candidate key terms (words of length 2..8)
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
  const s3 = sentences[2] || sentences[sentences.length - 1] || cleanText.slice(160, 240)

  const questions: Question[] = []

  // Question 1 (기본개념): Concept Definition
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
    // multiple or mixed
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

  // Question 2 (기본개념): Core Feature / Characteristic
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
    // short or mixed
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

  // Question 3 (응용): Practical Application
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
    // multiple or mixed
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

  // Question 4 (응용): Cause-and-Effect Analysis
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

  // Question 5 (응용): Troubleshooting & Verification
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
    // multiple
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
 * Calls Gemini API if GEMINI_API_KEY is present
 */
async function callGeminiAPI(text: string, quizType: QuizType, apiKey: string): Promise<Question[]> {
  const prompt = `
당신은 학습 평가 전문가입니다. 사용자가 입력한 학습 내용을 기반으로 이해도 점검을 위한 퀴즈 5문제를 생성해주세요.

[생성 규칙]
1. 반드시 총 5문제여야 합니다.
2. 문제 1, 2번: category="기본개념" (학습 내용의 핵심 개념, 정의, 기본 원리)
3. 문제 3, 4, 5번: category="응용" (사례 적용, 변형 상황 대처, 인과관계 분석, 오류 검증)
4. 문제 유형(quizType="${quizType}") 규칙:
   - "multiple": 5문제 모두 kind="multiple" (선택지 4개, answerIndex는 0~3 정수)
   - "short": 5문제 모두 kind="short" (answers는 정답 인정 문자열 배열, answerLabel은 대표 정답 표기)
   - "mixed": 객관식 3문제 + 주관식 2문제 또는 객관식 2문제 + 주관식 3문제 혼합
5. 해설(explanation)은 학습 텍스트에 기반하여 왜 정답인지 친절하고 명확하게 작성해주세요.

[입력 학습 텍스트]
${text}

반드시 아래 JSON 포맷으로만 응답하세요:
{
  "questions": [
    {
      "id": 1,
      "category": "기본개념",
      "kind": "multiple",
      "prompt": "질문 내용",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answerIndex": 0,
      "explanation": "해설 내용"
    },
    {
      "id": 2,
      "category": "기본개념",
      "kind": "short",
      "prompt": "질문 내용",
      "answers": ["정답단어1", "정답단어2"],
      "answerLabel": "대표 정답",
      "explanation": "해설 내용"
    }
  ]
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawJsonText) {
    throw new Error("Empty response from Gemini API")
  }

  const parsed = JSON.parse(rawJsonText)
  const questions: Question[] = parsed.questions || parsed

  if (!Array.isArray(questions) || questions.length !== 5) {
    throw new Error(`Invalid questions count: ${questions?.length}`)
  }

  return questions.map((q, idx) => ({
    ...q,
    id: idx + 1,
    category: (idx < 2 ? "기본개념" : "응용") as QuestionCategory,
  }))
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
