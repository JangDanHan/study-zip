export type QuizType = "multiple" | "short" | "mixed"

export type QuestionCategory = "기본개념" | "응용"

export interface BaseQuestion {
  id: number
  category: QuestionCategory
  prompt: string
  explanation: string
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  kind: "multiple"
  options: string[]
  /** index of the correct option */
  answerIndex: number
}

export interface ShortAnswerQuestion extends BaseQuestion {
  kind: "short"
  /** accepted answers (lowercased comparison) */
  answers: string[]
  answerLabel: string
}

export type Question = MultipleChoiceQuestion | ShortAnswerQuestion

const MULTIPLE_POOL: Omit<MultipleChoiceQuestion, "id" | "category">[] = [
  {
    kind: "multiple",
    prompt: "학습한 내용의 핵심 개념을 가장 잘 설명한 것은 무엇인가요?",
    options: [
      "여러 요소가 서로 독립적으로만 작동한다",
      "핵심 요소들이 상호작용하며 하나의 체계를 이룬다",
      "개념은 시간이 지나도 절대 변하지 않는다",
      "정의만 암기하면 응용은 필요하지 않다",
    ],
    answerIndex: 1,
    explanation:
      "핵심 개념은 개별 요소가 아니라 요소 간의 상호작용과 그 결과로 만들어지는 체계로 이해할 때 가장 정확합니다.",
  },
  {
    kind: "multiple",
    prompt: "다음 중 기본 원리에 해당하지 않는 것은 무엇인가요?",
    options: [
      "원인과 결과의 연결",
      "구성 요소의 역할 구분",
      "근거 없는 직관에 의한 판단",
      "규칙에 따른 일관된 적용",
    ],
    answerIndex: 2,
    explanation:
      "기본 원리는 일관된 규칙과 근거에 기반합니다. 근거 없는 직관은 원리로 보기 어렵습니다.",
  },
  {
    kind: "multiple",
    prompt: "학습 내용을 실제 상황에 적용할 때 가장 먼저 해야 할 일은?",
    options: [
      "문제의 조건을 정확히 파악한다",
      "결론부터 먼저 외운다",
      "예외 상황을 무시한다",
      "임의로 값을 대입한다",
    ],
    answerIndex: 0,
    explanation:
      "응용의 출발점은 주어진 조건과 제약을 정확히 이해하는 것입니다. 조건 파악 없이는 올바른 적용이 어렵습니다.",
  },
  {
    kind: "multiple",
    prompt: "개념을 확장하여 새로운 사례에 적용하는 과정을 무엇이라 하나요?",
    options: ["암기", "일반화", "복제", "생략"],
    answerIndex: 1,
    explanation:
      "특정 사례에서 얻은 원리를 다른 상황으로 넓혀 적용하는 것을 일반화라고 합니다.",
  },
  {
    kind: "multiple",
    prompt: "응용 문제를 풀 때 흔히 발생하는 실수는 무엇인가요?",
    options: [
      "조건을 끝까지 확인하는 것",
      "단위와 전제를 확인하지 않고 계산하는 것",
      "검산을 여러 번 하는 것",
      "가정을 명시적으로 적어두는 것",
    ],
    answerIndex: 1,
    explanation:
      "전제나 단위를 확인하지 않고 진행하면 계산이 맞아도 결론이 틀릴 수 있습니다.",
  },
]

const SHORT_POOL: Omit<ShortAnswerQuestion, "id" | "category">[] = [
  {
    kind: "short",
    prompt: "학습 내용의 핵심 개념을 한 단어로 요약하면 무엇인가요?",
    answers: ["체계", "시스템"],
    answerLabel: "체계 (시스템)",
    explanation:
      "여러 요소가 상호작용하며 이루는 하나의 구조를 '체계' 또는 '시스템'이라 부릅니다.",
  },
  {
    kind: "short",
    prompt: "원인과 결과가 논리적으로 연결되는 관계를 무엇이라 하나요?",
    answers: ["인과관계", "인과 관계", "인과성"],
    answerLabel: "인과관계",
    explanation:
      "하나의 사건이 다른 사건을 일으키는 논리적 연결을 인과관계라고 합니다.",
  },
  {
    kind: "short",
    prompt: "특정 사례에서 얻은 원리를 다른 상황으로 넓혀 적용하는 것을 무엇이라 하나요?",
    answers: ["일반화"],
    answerLabel: "일반화",
    explanation:
      "개별 사례의 원리를 더 넓은 범위로 확장해 적용하는 사고 과정을 일반화라고 합니다.",
  },
  {
    kind: "short",
    prompt: "응용 문제 풀이의 첫 단계로 반드시 파악해야 하는 것은 무엇인가요?",
    answers: ["조건", "전제", "조건과 제약"],
    answerLabel: "조건 (전제)",
    explanation:
      "주어진 조건과 제약을 정확히 파악하는 것이 올바른 응용의 출발점입니다.",
  },
  {
    kind: "short",
    prompt: "계산 결과가 옳은지 다시 확인하는 과정을 무엇이라 하나요?",
    answers: ["검산", "검토"],
    answerLabel: "검산",
    explanation:
      "결과의 정확성을 다시 확인하는 과정을 검산이라 하며, 실수를 줄이는 데 필수적입니다.",
  },
]

function categoryForIndex(index: number): QuestionCategory {
  return index < 2 ? "기본개념" : "응용"
}

/**
 * Builds a set of 5 dummy questions based on the selected quiz type.
 * - "multiple": 5 multiple-choice
 * - "short": 5 short-answer
 * - "mixed": alternating, starting with multiple choice
 */
export function generateQuestions(type: QuizType): Question[] {
  return Array.from({ length: 5 }, (_, i) => {
    const category = categoryForIndex(i)
    const useMultiple =
      type === "multiple" || (type === "mixed" && i % 2 === 0)

    if (useMultiple) {
      return { ...MULTIPLE_POOL[i], id: i + 1, category }
    }
    return { ...SHORT_POOL[i], id: i + 1, category }
  })
}
