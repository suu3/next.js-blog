# 작업 진행상황 (TOC 클릭 안정화 + 디자인 시스템 변수 적용)

## 진행상황
- 사용자 피드백 반영 완료:
  1. TOC 클릭이 한 번에 이동되지 않는 문제 개선
  2. primary color 및 디자인 토큰 적용 범위 확대
- TOC 클릭/active 안정화
  - TOC 항목을 `<a>`에서 `<button>`으로 전환해 클릭 이벤트 충돌 가능성 최소화
  - `scrollIntoView` 대신 헤더 오프셋(96px)을 고려한 `window.scrollTo` 이동으로 정확도 개선
  - URL hash 갱신 시 `encodeURIComponent` 적용
  - 초기 진입 시 hash가 있으면 해당 섹션을 active로 설정
- heading id 생성 보강
  - 제목 문자열 정규화 규칙을 정리하고
  - 같은 제목이 반복될 경우 `-2`, `-3` suffix를 부여해 고유 ID 보장
  - TOC 클릭 타겟 충돌(중복 id) 가능성 제거
- 디자인 시스템 적용 강화
  - 상세 페이지 카드/텍스트/태그/링크/버튼/코드블록/TOC 카드에 `--surface`, `--text`, `--muted`, `--line`, `--theme`, `--theme-soft`, `--bg` 토큰 적용
  - 전역 그림자/색상 하드코딩 일부를 변수 기반으로 치환

## Next Action Item
- markdown 렌더링을 `remark + rehype` 기반으로 단계적 전환 검토 (테이블/중첩 리스트/이미지 캡션 대응)
- 모바일 환경에서 TOC를 하단 고정 버튼 + 바텀시트 UI로 제공할지 UX 검토
- 코드블록 하이라이트(theme 연동) 적용 여부 확정

## 주의사항
- 현재 markdown 렌더링은 경량 파서 기반이며, 복잡한 확장 문법(GFM table/footnote 등)은 제한적입니다.
- `dangerouslySetInnerHTML`는 로컬 markdown 콘텐츠 렌더링 범위에서만 사용합니다.

## 사용자가 해야할 일
1. `pnpm install`
2. `pnpm build`
3. `pnpm dev --hostname 0.0.0.0 --port 3000`
4. 상세 페이지에서 아래 항목 확인
   - TOC 항목 클릭 시 한 번에 해당 제목으로 이동하는지
   - 스크롤 시 TOC active 항목이 자연스럽게 변경되는지
   - 링크/강조 색상이 `--theme (#ff6737)`로 반영되는지
