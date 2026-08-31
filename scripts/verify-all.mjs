/**
 * Sprint 4 Automated Comprehensive Verification Script
 * Validates PRD rules, API constraints, Exception handlings, and Scoring algorithms
 */

async function runTests() {
  console.log("=== [Sprint 4: Verification Suite Starting] ===")
  let passed = 0
  let failed = 0

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${testName}`)
      failed++
    }
  }

  const BASE_URL = "http://localhost:3000"

  // 1. Test PRD 5-1: Empty input rejected
  try {
    const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "   ", quizType: "multiple" }),
    })
    const data = await res.json()
    assert(res.status === 400 && data.error?.includes("입력해 주세요"), "PRD 5-1: Empty text returns 400 error")
  } catch (e) {
    assert(false, `PRD 5-1 test threw error: ${e.message}`)
  }

  // 2. Test PRD 5-2: Short input (< 100 chars) rejected
  try {
    const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "짧은 텍스트입니다. 100자가 되지 않습니다.", quizType: "multiple" }),
    })
    const data = await res.json()
    assert(res.status === 400 && data.error?.includes("조금 더 길게"), "PRD 5-2: Short text (<100) returns 400 error")
  } catch (e) {
    assert(false, `PRD 5-2 test threw error: ${e.message}`)
  }

  // 3. Test PRD 5-3: Long input (> 3000 chars) rejected
  try {
    const longText = "가".repeat(3005)
    const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: longText, quizType: "multiple" }),
    })
    const data = await res.json()
    assert(res.status === 400 && data.error?.includes("3,000자 이내"), "PRD 5-3: Long text (>3000) returns 400 error")
  } catch (e) {
    assert(false, `PRD 5-3 test threw error: ${e.message}`)
  }

  // 4. Test Valid Text: Exactly 5 questions (Concept 2 + Application 3)
  const validStudyText = `운영체제(OS)는 컴퓨터 하드웨어와 사용자 간의 중재자 역할을 하는 시스템 소프트웨어입니다. 프로세스 관리, 메모리 관리, 파일 시스템 관리, 입출력 장치 제어가 주요 기능입니다. CPU 스케줄링은 여러 프로세스가 CPU를 효율적으로 나누어 쓰도록 스케줄링 알고리즘(FCFS, SJF, Round Robin 등)을 적용합니다. 가상 메모리는 주기억장치의 용량 한계를 극복하기 위해 보조기억장치를 활용하는 기법으로 페이징과 세그멘테이션으로 구현됩니다. 데드락은 둘 이상의 프로세스가 서로의 자원을 무한정 대기하는 상태를 의미하며 상호배제, 점유대기, 비선점, 순환대기 4가지 조건이 만족될 때 발생합니다.`

  for (const qType of ["multiple", "short", "mixed"]) {
    try {
      const start = Date.now()
      const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: validStudyText, quizType: qType }),
      })
      const elapsed = (Date.now() - start) / 1000
      const data = await res.json()

      assert(res.ok && data.success, `API success for quizType='${qType}'`)
      assert(data.questions?.length === 5, `Returns exactly 5 questions for quizType='${qType}'`)
      
      const q1 = data.questions[0]
      const q2 = data.questions[1]
      const q3 = data.questions[2]
      const q4 = data.questions[3]
      const q5 = data.questions[4]

      assert(q1.category === "기본개념" && q2.category === "기본개념", `Questions 1 & 2 are '기본개념' for ${qType}`)
      assert(q3.category === "응용" && q4.category === "응용" && q5.category === "응용", `Questions 3, 4, 5 are '응용' for ${qType}`)
      assert(elapsed <= 15, `Response speed <= 15s (Actual: ${elapsed.toFixed(2)}s) for ${qType}`)

      if (qType === "multiple") {
        const allMultiple = data.questions.every((q) => q.kind === "multiple" && Array.isArray(q.options) && q.options.length === 4 && typeof q.answerIndex === "number")
        assert(allMultiple, "All 5 questions are 4-option multiple-choice")
      } else if (qType === "short") {
        const allShort = data.questions.every((q) => q.kind === "short" && Array.isArray(q.answers) && q.answers.length > 0 && q.answerLabel)
        assert(allShort, "All 5 questions are valid short-answer questions")
      } else if (qType === "mixed") {
        const kinds = data.questions.map((q) => q.kind)
        assert(kinds.includes("multiple") && kinds.includes("short"), `Mixed quiz contains both multiple and short kinds: ${kinds.join(", ")}`)
      }
    } catch (e) {
      assert(false, `Test for quizType='${qType}' threw error: ${e.message}`)
    }
  }

  console.log(`\n=== Verification Results: ${passed} passed, ${failed} failed ===`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
