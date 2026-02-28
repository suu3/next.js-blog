# 작업 진행상황 (Tailwind → PandaCSS 전환 시도)

## 진행상황
- 요청사항: Tailwind에서 PandaCSS로 전환 가능 여부 확인.
- 실제 전환 작업을 진행하기 위해 `@pandacss/dev` 설치를 시도했습니다.
  - `pnpm add -D @pandacss/dev`
  - `npm i -D @pandacss/dev`
- 결과: 현재 환경의 패키지 보안 정책/레지스트리 제한으로 `403 Forbidden`이 발생하여 PandaCSS 패키지 설치가 차단되었습니다.
- 따라서 이번 턴에서는 코드 전환을 강제로 진행하지 않고, 환경 제약을 명확히 확인/기록했습니다.

## Next Action Item
- 레지스트리 정책에서 `@pandacss/*` 패키지 설치 허용 후 재시도
- 허용 즉시 아래 순서로 전환 진행
  1. `panda.config.ts` 생성
  2. `styled-system` 코드 생성
  3. `app/layout.tsx`, `app/page.tsx`, `components/gnb.tsx`, `components/post-search.tsx` 순으로 className 스타일을 PandaCSS `css()`/recipe로 치환
  4. `@import "tailwindcss"` 제거 및 Tailwind 의존성 정리

## 주의사항
- 현재 상태에서 Tailwind를 먼저 제거하면 스타일이 즉시 깨질 수 있으므로, PandaCSS 설치/코드생성 선행이 필요합니다.
- 환경 제약이 해소되기 전에는 “완전 전환” 커밋을 만드는 것이 오히려 리스크가 큽니다.

## 사용자가 해야할 일
- 사내/프로젝트 패키지 정책에서 `@pandacss/dev` 설치를 허용해주세요.
- 가능하면 허용된 사설 레지스트리 경로(또는 미러)를 알려주세요.
- 허용 후 다시 요청 주시면 바로 PandaCSS 전환 커밋으로 이어서 진행하겠습니다.
