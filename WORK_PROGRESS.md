# 작업 진행상황 (사용자 액션 가이드: PandaCSS 전환)

## 진행상황
- 요청사항("내가 어캐해야하지?")에 맞춰, 현재 막힌 원인과 사용자 액션 플랜을 실행 순서대로 정리했습니다.
- 현재 막힌 원인 요약
  - `@pandacss/dev` 설치가 레지스트리 정책으로 `403 Forbidden` 차단됨
  - 따라서 PandaCSS 코드 생성(`styled-system`)을 시작할 수 없는 상태

## Next Action Item
- 사용자 측에서 패키지 설치 권한(또는 레지스트리 설정)을 먼저 해결
- 해결 직후 제가 즉시 진행할 작업
  1. `@pandacss/dev` 설치
  2. `panda.config.ts` 생성 + codegen
  3. `app/layout.tsx`, `app/page.tsx`, `components/gnb.tsx`, `components/post-search.tsx` 순으로 변환
  4. Tailwind 제거 및 빌드 검증

## 주의사항
- 지금 Tailwind를 먼저 지우면 스타일이 전부 깨집니다.
- 반드시 "Panda 설치 성공 → codegen 성공" 이후에 점진 변환해야 안전합니다.
- 현재 `.npmrc`에는 `auto-install-peers=true`만 있고, 별도 npm registry 인증 정보는 없습니다.

## 사용자가 해야할 일
아래 3가지만 해주시면 됩니다.

1. **레지스트리 정책 열기**
   - `@pandacss/dev` 설치 허용(사내 프록시/보안 정책 예외 추가)

2. **(필요 시) npm 토큰/registry 설정**
   - 사내 환경이라면 프로젝트 루트 `.npmrc`에 허용된 registry와 토큰 설정

3. **설치 확인 명령 실행**
   - `pnpm add -D @pandacss/dev`
   - 위 명령이 성공하면 바로 알려주세요. 그다음 턴에서 제가 전환 커밋까지 이어서 진행합니다.

## 제가 이어서 바로 할 일(사용자 확인 후)
- PandaCSS 초기 설정부터 Tailwind 제거까지 한 번에 진행
- `pnpm build` 통과 확인
- 변경 화면 스크린샷 첨부
