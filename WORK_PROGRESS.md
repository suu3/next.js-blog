# 작업 진행상황

## 진행상황
- 다크 모드에서 색이 어색하게 보이던 원인을 토큰 alias 매핑으로 보고, 매핑 기준을 원본 팔레트 의미에 맞게 다시 조정했습니다.
  - `--surface`: 라이트는 `--color-background`, 다크는 `--color-bg-surface`
  - `--line`: 라이트는 `--color-neutral-01`, 다크는 `--color-neutral-02`
  - `--theme-soft`: 라이트/다크 모두 `--color-theme-04` 기반으로 통일
- 다크 모드에서 배경 데코(상단 노란 원형 + 배경 이미지) 대비가 과도하게 튀지 않도록 `.page-shell` 전용 dark override를 추가했습니다.
- 기존 테마 전환 로직(`localStorage.theme` + `body light/dark class + data-theme + themechange`)과 utterances 동기화 로직은 유지했습니다.

## Next Action Item
- 다크 모드에서 카드/코드블록/링크 hover 색 대비를 실제 사용 시나리오 기준으로 추가 튜닝
- 필요 시 다크 전용 배경 SVG(채도/밝기 낮춘 버전) 별도 제작 후 분기 적용
- 사용자 확인 후, 테마 버튼 아이콘을 이모지에서 SVG(sun/moon)로 교체할지 결정

## 주의사항
- 현재 색상은 “기존 컴포넌트에서 쓰는 공통 alias 변수” 기준으로 정렬한 상태라, 일부 개별 컴포넌트가 고정 HEX를 사용하면 추가 보정이 필요할 수 있습니다.
- `pnpm lint`는 저장소 ESLint 설정이 대화형 초기화 상태라 CI/로컬 비대화형 환경에서 그대로는 통과하지 않습니다.
- 외부 댓글 위젯(utterances)은 iframe 메시징 의존으로 브라우저/확장 환경에 따라 테마 반영 타이밍이 지연될 수 있습니다.

## 사용자가 해야할 일
1. `pnpm install`
2. `pnpm dev`
3. 홈/포스트 상세에서 라이트↔다크 전환 확인
   - 페이지 전체 배경/헤더/푸터/네비 버튼 경계선이 자연스럽게 바뀌는지
   - 다크 모드에서 상단 배경 데코가 과하게 튀지 않는지
   - 새로고침 후 마지막 테마가 유지되는지
4. 포스트 상세 댓글(utterances)에서 테마 전환 동기화 확인
