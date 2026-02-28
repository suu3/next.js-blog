# 작업 진행상황

## 진행상황
- 포스트 상세 페이지의 본문 렌더링을 `pre` 기반의 raw 텍스트 출력에서, Markdown 구조(헤딩/문단/리스트/코드/blockquote/링크/inline code)를 인식하는 컴포넌트로 교체했습니다.
- 우측 Table of Contents 사이드바를 추가하고, active 하이라이트 책임을 스크롤(IntersectionObserver) 기준으로만 동작하도록 정리했습니다.
- TOC 항목 클릭 시에는 해당 섹션으로 `smooth scroll`만 수행하도록 처리해, 클릭 상태와 스크롤 상태가 충돌하며 깜빡이는 현상을 줄이도록 반영했습니다.
- `prefetch={false}`가 코드로 본문에 등장할 때도 inline code 스타일이 적용되어 더 읽기 쉬운 시각 톤으로 보이도록 스타일링했습니다.
- 포스트 메타(태그, 목록 복귀 버튼)도 neo-ish 톤에 맞춰 스타일을 다듬었습니다.

## Next Action Item
- 실제 긴 글 2~3개에서 TOC active 전환 시점(특히 헤딩 간격이 짧은 구간) 체감 확인 후, `rootMargin/threshold` 미세 조정
- 필요 시 모바일에서도 TOC를 접이식으로 노출할지 UX 확정

## 주의사항
- 현재 Markdown 파서는 프로젝트 의존성 추가 제한(외부 패키지 설치 403) 때문에 내부 경량 파서 방식으로 구현되어, 고급 문법(테이블, 중첩 리스트, 복잡한 HTML)은 완전 대응하지 않습니다.
- 코드 블록 언어별 하이라이팅(shiki/prism 등)은 아직 적용하지 않았습니다.

## 사용자가 해야할 일
1. `pnpm install`
2. `pnpm build`
3. `pnpm dev`
4. 포스트 상세 페이지에서 아래 항목 확인
   - TOC 클릭 시 해당 섹션 이동만 되는지
   - 스크롤 중 TOC active가 자연스럽게 바뀌는지
   - 본문 내 `` `prefetch={false}` `` inline code 스타일이 의도대로 보이는지
