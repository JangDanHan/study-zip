"use client"

import { ArrowRight, Bolt, Clock, Eye, Lightbulb, Menu, Sparkles, TrendingUp, Zap } from "lucide-react"

interface LandingPageProps {
  onStartQuiz: () => void
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f0e8] text-[#1a1a1a] selection:bg-[#ffcc00] selection:text-[#1a1a1a]">
      {/* TopNavBar */}
      <nav className="sticky top-0 z-50 bg-[#f5f0e8] border-b-[3px] border-[#1a1a1a]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] tracking-tight hover:text-[#e63b2e] transition-colors cursor-pointer" onClick={onStartQuiz}>
              QuizGen
            </span>
            <span className="hidden sm:inline-block bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 text-xs font-mono font-black uppercase shadow-[2px_2px_0px_#1a1a1a]">
              AI 퀴즈 생성기
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#why-quizgen"
              className="font-display font-bold text-base text-[#1a1a1a] hover:text-[#0055ff] transition-colors uppercase tracking-wide"
            >
              Why QuizGen
            </a>
            <a
              href="#how-it-works"
              className="font-display font-bold text-base text-[#1a1a1a] hover:text-[#0055ff] transition-colors uppercase tracking-wide"
            >
              How it works
            </a>
          </div>

          <button
            onClick={onStartQuiz}
            className="brutal-btn bg-[#ffcc00] text-[#1a1a1a] font-display font-extrabold text-base px-6 py-2.5 border-[3px] border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] uppercase hover:bg-[#1a1a1a] hover:text-[#ffcc00] transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b-[3px] border-[#1a1a1a] py-20 lg:py-28 bg-[#f5f0e8]">
          {/* Decorative Geometric Elements */}
          <div className="absolute top-10 left-6 sm:left-12 w-28 sm:w-36 h-28 sm:h-36 bg-[#e63b2e] rounded-full border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] opacity-90 animate-pulse pointer-events-none -z-0" />
          <div className="absolute bottom-8 right-6 sm:right-16 w-36 sm:w-48 h-36 sm:h-48 bg-[#0055ff] rotate-12 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] opacity-90 pointer-events-none -z-0" />
          <div className="absolute top-1/3 right-1/4 w-20 sm:w-28 h-20 sm:h-28 bg-[#ffcc00] rotate-45 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] opacity-90 pointer-events-none -z-0" />

          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#ffcc00] px-3.5 py-1 text-xs font-mono font-black uppercase tracking-widest mb-6 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#ffcc00]">
              <Sparkles className="size-3.5" />
              <span>POWERED BY GOOGLE GEMINI 3.6 FLASH</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight mb-8 text-[#1a1a1a]">
              공부한 내용을 <br />
              <span className="inline-block bg-[#ffcc00] text-[#1a1a1a] px-4 py-2 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] mt-4 -rotate-2">
                퀴즈로 만드세요.
              </span>
              <br />
              <span className="text-[#e63b2e] inline-block mt-4">단 몇 초 만에.</span>
            </h1>

            <p className="font-sans text-lg md:text-2xl text-[#1a1a1a]/85 max-w-2xl mb-10 font-medium leading-relaxed">
              텍스트만 붙여넣으면 AI가 즉시 핵심을 파악하여 <strong className="text-[#1a1a1a] bg-[#ffcc00]/50 px-1">기본개념 2문제 + 응용 3문제</strong>를 생성합니다. 수동으로 문제를 만드는 시간을 아끼고 학습에 집중하세요.
            </p>

            <button
              onClick={onStartQuiz}
              className="brutal-btn inline-flex items-center justify-center bg-[#1a1a1a] text-[#ffffff] hover:bg-[#ffcc00] hover:text-[#1a1a1a] font-display font-extrabold text-2xl md:text-3xl px-10 py-6 border-[3.5px] border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] uppercase tracking-wider transition-all"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="ml-3 size-7 sm:size-8 stroke-[3]" />
            </button>

            {/* Quick Badge List */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-8 text-xs font-mono font-bold text-[#1a1a1a]">
              <span className="bg-white border-2 border-[#1a1a1a] px-3 py-1 shadow-[2px_2px_0px_#1a1a1a]">
                ✓ 로그인 없음
              </span>
              <span className="bg-white border-2 border-[#1a1a1a] px-3 py-1 shadow-[2px_2px_0px_#1a1a1a]">
                ✓ 100% 무료
              </span>
              <span className="bg-white border-2 border-[#1a1a1a] px-3 py-1 shadow-[2px_2px_0px_#1a1a1a]">
                ✓ 주관식 문장 첨삭 지원
              </span>
              <span className="bg-white border-2 border-[#1a1a1a] px-3 py-1 shadow-[2px_2px_0px_#1a1a1a]">
                ✓ 노션 오답노트 복사
              </span>
            </div>
          </div>
        </section>

        {/* Value Proposition Section ("왜 QuizGen인가요?") */}
        <section id="why-quizgen" className="py-24 bg-[#e8e3da] border-b-[3px] border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#1a1a1a] mb-16 text-center uppercase tracking-tight">
              왜 QuizGen인가요?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#f5f0e8] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] hover:bg-[#e63b2e] hover:text-[#ffffff] group transition-colors duration-300">
                <div className="w-16 h-16 bg-[#ffcc00] border-[2.5px] border-[#1a1a1a] flex items-center justify-center mb-6 group-hover:bg-[#f5f0e8] group-hover:text-[#1a1a1a] transition-colors shadow-[3px_3px_0px_#1a1a1a]">
                  <Clock className="size-8 text-[#1a1a1a]" />
                </div>
                <h3 className="font-display text-3xl font-extrabold mb-4">시간 절약</h3>
                <p className="font-sans text-base sm:text-lg font-medium leading-relaxed">
                  수동으로 문제를 낼 필요 없이 AI가 즉시 생성합니다. 당신의 시간은 문제를 푸는 데 쓰세요.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#f5f0e8] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] group transition-colors duration-300 transform md:-translate-y-4">
                <div className="w-16 h-16 bg-[#0055ff] text-white border-[2.5px] border-[#1a1a1a] flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] group-hover:text-[#ffcc00] transition-colors shadow-[3px_3px_0px_#1a1a1a]">
                  <Lightbulb className="size-8" />
                </div>
                <h3 className="font-display text-3xl font-extrabold mb-4">기억력 강화</h3>
                <p className="font-sans text-base sm:text-lg font-medium leading-relaxed">
                  단순히 읽는 것을 넘어, 능동적 회상(Active Recall)을 통해 뇌를 자극하고 학습 효율을 극대화합니다.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#f5f0e8] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] hover:bg-[#0055ff] hover:text-[#ffffff] group transition-colors duration-300">
                <div className="w-16 h-16 bg-[#e63b2e] text-white border-[2.5px] border-[#1a1a1a] flex items-center justify-center mb-6 group-hover:bg-[#f5f0e8] group-hover:text-[#1a1a1a] transition-colors shadow-[3px_3px_0px_#1a1a1a]">
                  <TrendingUp className="size-8" />
                </div>
                <h3 className="font-display text-3xl font-extrabold mb-4">객관적 자기진단</h3>
                <p className="font-sans text-base sm:text-lg font-medium leading-relaxed">
                  자신이 무엇을 알고 무엇을 모르는지 메타인지를 통해 정확히 파악하고 약점을 보완할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-[#f5f0e8] border-b-[3px] border-[#1a1a1a]" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#1a1a1a] uppercase tracking-tight mb-6 md:mb-0">
                작동 방식
              </h2>
              <div className="w-full md:w-1/2 h-3 bg-[#1a1a1a] border-2 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a]" />
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-[#1a1a1a]">
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-20 h-20 bg-[#ffcc00] border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] z-10 shrink-0 font-display font-extrabold text-3xl text-[#1a1a1a] md:mx-auto group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-[#eee9e0] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
                  <h3 className="font-display text-2xl font-bold mb-3 text-[#e63b2e]">학습 내용 입력</h3>
                  <p className="font-sans text-base sm:text-lg font-medium leading-relaxed text-[#1a1a1a]/85">
                    공부한 텍스트나 필기를 그대로 붙여넣으세요. 원클릭 예시 버튼(IT, 역사, 경제, 물리)을 눌러 바로 테스트해볼 수도 있습니다.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-20 h-20 bg-[#0055ff] text-white border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] z-10 shrink-0 font-display font-extrabold text-3xl md:mx-auto group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-[#eee9e0] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
                  <h3 className="font-display text-2xl font-bold mb-3 text-[#1a1a1a]">AI 문제 생성</h3>
                  <p className="font-sans text-base sm:text-lg font-medium leading-relaxed text-[#1a1a1a]/85">
                    Gemini 3.6 Flash 모델이 문맥을 분석하여 기본개념 확인(2문항)부터 실무 응용(3문항)까지 정확히 5문제를 생성합니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-20 h-20 bg-[#e63b2e] text-white border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] z-10 shrink-0 font-display font-extrabold text-3xl md:mx-auto group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-[#eee9e0] p-8 border-[3px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a]">
                  <h3 className="font-display text-2xl font-bold mb-3 text-[#1a1a1a]">실력 확인 & 첨삭</h3>
                  <p className="font-sans text-base sm:text-lg font-medium leading-relaxed text-[#1a1a1a]/85">
                    생성된 퀴즈를 풀고 제출하세요. AI가 채점 결과와 함께 1:1 맞춤 첨삭 및 노션 호환 오답노트 마크다운 복사를 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 sm:py-32 bg-[#1a1a1a] text-white relative overflow-hidden" id="start">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="font-display text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-white">
              준비되셨나요?
            </h2>
            <p className="font-display text-2xl md:text-4xl text-[#ffcc00] mb-12 font-bold">
              지금 바로 첫 퀴즈를 만들어보세요
            </p>
            <button
              onClick={onStartQuiz}
              className="brutal-btn inline-flex items-center justify-center bg-[#ffcc00] text-[#1a1a1a] font-display font-extrabold text-2xl md:text-4xl px-12 py-7 border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] uppercase tracking-widest hover:bg-[#f5f0e8] hover:text-[#1a1a1a] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
            >
              <span>시작하기</span>
              <Bolt className="ml-4 size-8 sm:size-10 font-bold fill-[#1a1a1a]" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f0e8] border-t-[3px] border-[#1a1a1a] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-8 max-w-7xl mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-display text-2xl font-extrabold text-[#1a1a1a] mb-1 tracking-tight">QuizGen</span>
            <span className="font-sans text-xs font-mono font-medium text-[#1a1a1a]/70">
              © 2026 QuizGen AI. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-mono font-bold text-[#1a1a1a]">
            <span>BAUHAUS NEO-BRUTALIST DESIGN</span>
            <span>·</span>
            <span>GEMINI 3.6 FLASH</span>
            <span>·</span>
            <span>VERCEL HOSTED</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
