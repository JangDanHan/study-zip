"use client"

import { ArrowRight, BookOpen, CheckCircle2, Cpu, FileText, Layers, ShieldCheck, Sparkles, Zap } from "lucide-react"

interface LandingPageProps {
  onStartQuiz: () => void
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 w-full max-w-4xl mx-auto pb-16">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b-[2.5px] border-[#1a1a1a] pb-4 pt-2">
        <div className="flex items-center gap-2.5">
          <span className="bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 text-xs font-black tracking-wider uppercase">
            AI Tool
          </span>
          <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#1a1a1a]">
            STUDY-ZIP
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono font-bold text-[#1a1a1a]/70">
            BAUHAUS EDITION v2.0
          </span>
          <button
            onClick={onStartQuiz}
            className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] px-3.5 py-1.5 text-xs font-black uppercase flex items-center gap-1.5"
          >
            <span>퀴즈 시작</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col gap-8 pt-4 sm:pt-8">
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#1a1a1a] text-[#ffcc00] px-3 py-1 text-xs font-black uppercase tracking-wider font-display">
            Form Follows Learning
          </span>
          <span className="bg-[#0055ff] text-white px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-[#1a1a1a]">
            Gemini 3.6 Flash Engine
          </span>
          <span className="bg-[#ffffff] text-[#1a1a1a] px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-[#1a1a1a]">
            No Login · 100% Free
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1a1a1a] leading-[1.05] uppercase">
            학습한 내용을 붙여넣으면, <br className="hidden sm:inline" />
            <span className="bg-[#ffcc00] px-2 py-0.5 border-[2.5px] border-[#1a1a1a] inline-block mt-1 sm:mt-0 shadow-[4px_4px_0px_#1a1a1a]">
              이해도 점검 퀴즈
            </span>
            가 완성됩니다.
          </h1>
          <p className="text-base sm:text-xl font-medium text-[#1a1a1a]/85 max-w-2xl leading-relaxed pt-2">
            단순 키워드 매칭을 넘어 기본개념 2문제와 실무/사례 응용 3문제를 생성합니다.
            회원가입과 로그인 없이, 단 5초 만에 학습 이해도를 검증하세요.
          </p>
        </div>

        {/* Hero CTA Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={onStartQuiz}
            className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] px-8 py-4 text-lg sm:text-xl font-black uppercase tracking-wide flex items-center justify-center gap-3 shadow-[6px_6px_0px_#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ffcc00] transition-colors"
          >
            <span>지금 퀴즈 생성하기</span>
            <ArrowRight className="size-6 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a]/80 px-2">
            <CheckCircle2 className="size-4 text-[#0055ff]" />
            <span>객관식 · 주관식 · 혼합 모드 지원 (100자~3,000자)</span>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-3.5 shadow-[3px_3px_0px_#1a1a1a] flex flex-col gap-1">
            <span className="font-display font-black text-2xl text-[#0055ff]">05</span>
            <span className="text-xs font-black uppercase text-[#1a1a1a]">고정 5문항 출제</span>
            <span className="text-[11px] text-[#5a554e]">개념 2문항 + 응용 3문항</span>
          </div>
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-3.5 shadow-[3px_3px_0px_#1a1a1a] flex flex-col gap-1">
            <span className="font-display font-black text-2xl text-[#e63b2e]">0s</span>
            <span className="text-xs font-black uppercase text-[#1a1a1a]">가입 및 결제 없음</span>
            <span className="text-[11px] text-[#5a554e]">무상태(Stateless) 즉시 시작</span>
          </div>
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-3.5 shadow-[3px_3px_0px_#1a1a1a] flex flex-col gap-1">
            <span className="font-display font-black text-2xl text-[#1a1a1a]">AI</span>
            <span className="text-xs font-black uppercase text-[#1a1a1a]">주관식 문장 첨삭</span>
            <span className="text-[11px] text-[#5a554e]">의미 분석 기반 맞춤 피드백</span>
          </div>
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-3.5 shadow-[3px_3px_0px_#1a1a1a] flex flex-col gap-1">
            <span className="font-display font-black text-2xl text-[#ffcc00]">MD</span>
            <span className="text-xs font-black uppercase text-[#1a1a1a]">오답노트 복사</span>
            <span className="text-[11px] text-[#5a554e]">노션/옵시디언 마크다운</span>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="flex flex-col gap-6 border-t-[2.5px] border-[#1a1a1a] pt-12">
        <div className="flex flex-col gap-2">
          <span className="font-display text-xs font-black uppercase text-[#0055ff] tracking-widest">
            CORE PRINCIPLES
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#1a1a1a]">
            왜 STUDY-ZIP으로 공부해야 할까요?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="brutal-card p-6 flex flex-col justify-between gap-6 bg-[#ffffff]">
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-[#ffcc00] border-2 border-[#1a1a1a] flex items-center justify-center font-black">
                <Layers className="size-5 text-[#1a1a1a]" />
              </div>
              <h3 className="font-display text-lg font-black text-[#1a1a1a] uppercase">
                01. 체계적인 2+3 구조
              </h3>
              <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                단순 암기용 문제가 아닙니다. 1~2번은 기본 정의와 핵심 원리를, 3~5번은 실무 사례와 상황별 문제 해결력을 테스트합니다.
              </p>
            </div>
            <div className="border-t-2 border-[#1a1a1a] pt-3 text-xs font-mono font-bold text-[#1a1a1a]/60">
              PRD COMPLIANCE 100%
            </div>
          </div>

          {/* Card 2 */}
          <div className="brutal-card p-6 flex flex-col justify-between gap-6 bg-[#ffffff]">
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-[#0055ff] border-2 border-[#1a1a1a] flex items-center justify-center font-black">
                <Cpu className="size-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-black text-[#1a1a1a] uppercase">
                02. Gemini 3.6 실시간 채점
              </h3>
              <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                주관식에 문장형으로 작성해도 인공지능이 핵심 개념 포함 여부를 의미론적으로 판별하여 1:1 맞춤 첨삭 피드백을 제공합니다.
              </p>
            </div>
            <div className="border-t-2 border-[#1a1a1a] pt-3 text-xs font-mono font-bold text-[#1a1a1a]/60">
              SEMANTIC AI GRADING
            </div>
          </div>

          {/* Card 3 */}
          <div className="brutal-card p-6 flex flex-col justify-between gap-6 bg-[#ffffff]">
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-[#e63b2e] border-2 border-[#1a1a1a] flex items-center justify-center font-black">
                <FileText className="size-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-black text-[#1a1a1a] uppercase">
                03. 원클릭 마크다운 오답노트
              </h3>
              <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                푼 문제, 내 제출 답안, 정답, 상세 해설을 클릭 한 번으로 마크다운 포맷으로 복사하여 노션이나 옵시디언에 즉시 아카이빙하세요.
              </p>
            </div>
            <div className="border-t-2 border-[#1a1a1a] pt-3 text-xs font-mono font-bold text-[#1a1a1a]/60">
              MARKDOWN EXPORT
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="flex flex-col gap-8 border-t-[2.5px] border-[#1a1a1a] pt-12">
        <div className="flex flex-col gap-2">
          <span className="font-display text-xs font-black uppercase text-[#e63b2e] tracking-widest">
            WORKFLOW
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#1a1a1a]">
            3단계 퀴즈 워크플로우
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-5 shadow-[4px_4px_0px_#1a1a1a] flex flex-col gap-3">
            <span className="font-display text-sm font-black bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 w-fit">
              STEP 01
            </span>
            <h4 className="font-display text-base font-black text-[#1a1a1a]">학습 텍스트 입력</h4>
            <p className="text-xs text-[#1a1a1a]/80 leading-relaxed">
              공부한 교재, 강의 필기, 요약본을 100자 이상 붙여넣거나 원클릭 예시 버튼을 누릅니다.
            </p>
          </div>
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-5 shadow-[4px_4px_0px_#1a1a1a] flex flex-col gap-3">
            <span className="font-display text-sm font-black bg-[#0055ff] text-white border-2 border-[#1a1a1a] px-2 py-0.5 w-fit">
              STEP 02
            </span>
            <h4 className="font-display text-base font-black text-[#1a1a1a]">문제 유형 선택 & 생성</h4>
            <p className="text-xs text-[#1a1a1a]/80 leading-relaxed">
              객관식(4지선다), 주관식(서술/단답), 혼합 모드 중 원하는 방식을 골라 퀴즈를 생성합니다.
            </p>
          </div>
          <div className="border-[2.5px] border-[#1a1a1a] bg-white p-5 shadow-[4px_4px_0px_#1a1a1a] flex flex-col gap-3">
            <span className="font-display text-sm font-black bg-[#e63b2e] text-white border-2 border-[#1a1a1a] px-2 py-0.5 w-fit">
              STEP 03
            </span>
            <h4 className="font-display text-base font-black text-[#1a1a1a]">즉시 채점 & 해설 복습</h4>
            <p className="text-xs text-[#1a1a1a]/80 leading-relaxed">
              문제를 풀고 채점 버튼을 누르면 점수, AI 첨삭 해설 확인 및 오답노트 복사가 가능합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-[3px] border-[#1a1a1a] bg-[#ffcc00] p-8 sm:p-12 shadow-[8px_8px_0px_#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#1a1a1a]">
            지금 바로 나의 학습 이해도를 점검하세요.
          </h3>
          <p className="text-sm sm:text-base font-bold text-[#1a1a1a]/80">
            별도의 가입 없이 5초 안에 퀴즈가 생성됩니다.
          </p>
        </div>
        <button
          onClick={onStartQuiz}
          className="brutal-btn bg-[#1a1a1a] text-[#ffcc00] px-8 py-4 text-lg font-black uppercase flex items-center gap-2 shrink-0 hover:bg-white hover:text-[#1a1a1a] transition-colors"
        >
          <span>퀴즈 시작하기</span>
          <ArrowRight className="size-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t-[2.5px] border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-[#1a1a1a]/70">
        <div>STUDY-ZIP · FORM FOLLOWS LEARNING</div>
        <div>POWERED BY GEMINI 3.6 FLASH · VERCEL DEPLOYED</div>
      </footer>
    </div>
  )
}
