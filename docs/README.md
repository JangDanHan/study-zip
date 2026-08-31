# 📚 Study-Zip 프로젝트 문서 (Docs)

본 디렉터리는 **학습 확인 퀴즈 생성 서비스**의 기획 및 개발 관리를 위한 공식 문서 모음입니다.

---

## 📂 문서 구조

1. [**PRD (제품 요구사항 정의서)**](file:///c:/study_zip/PRD.md)
   - 프로젝트 목표, 핵심 시나리오, 단일 화면 명세, 기능 및 7가지 예외 처리 정책, 완료 조건(DoD).
2. [**개발 계획서 (development-plan.md)**](file:///c:/study_zip/docs/development-plan.md)
   - PRD 기반 아키텍처 분석, 기술 스택, 4단계 스프린트 마일스톤 및 최종 구현 결과 보고.
3. [**스프린트 백로그 (sprint-backlog.md)**](file:///c:/study_zip/docs/sprint-backlog.md)
   - 스프린트 1~4별 세부 구현 태스크 체크리스트 및 완료 상태 추적.

---

## 🚀 스프린트 개발 완료 현황

- **Sprint 1 (✅ 100% 완료)**: 입력 영역 UX 및 텍스트 사전 검증 (100자~3,000자, 미입력 방지, 글자수 카운터, autofocus)
- **Sprint 2 (✅ 100% 완료)**: AI 퀴즈 생성 API (`/api/quiz/generate`), 30초 타임아웃, 오류 복구 UX, 지능형 Fallback 탑재
- **Sprint 3 (✅ 100% 완료)**: 문제 풀이 진행률(Progress), 4지선다/주관식 카드, 유연한 주관식 채점 알고리즘, 미응답 오답 처리, 결과/해설 차트
- **Sprint 4 (✅ 100% 완료)**: 7대 예외 시나리오 전수 자동화 검증([`scripts/verify-all.mjs`](file:///c:/study_zip/scripts/verify-all.mjs)), DoD 100% 달성, 프로덕션 빌드 통과

---

## 💻 실행 및 검증 명령어

```bash
# 개발 서버 실행 (localhost:3000)
npm run dev

# 7대 예외 및 PRD 완료 조건 자동화 검증 스위트 실행
node scripts/verify-all.mjs

# 프로덕션 빌드 검증
npm run build
```
