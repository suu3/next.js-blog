# 작업 진행상황

## 진행상황
- 사라졌던 댓글 위젯(utterances)을 포스트 상세 하단에 복구했습니다.
  - 클라이언트 컴포넌트(`PostComments`)에서 `utteranc.es` 스크립트를 동적으로 주입하도록 구현
  - `issue-term`은 포스트 slug 기반으로 연결
- Markdown 이미지 경로 처리 문제를 해결했습니다.
  - `![...](./1.png)` 같은 상대경로를 빌드 시 `/content-assets/...` 절대경로로 정규화
  - `content` 폴더의 이미지/asset 파일(.md 제외)을 `public/content-assets`로 동기화해서 실제 정적 파일로 서빙되게 처리
- Markdown 렌더러에서 이미지 문법을 인식하도록 추가했습니다.
  - `![alt](url)` 렌더링 지원
  - `![alt](url "caption")`의 caption(title) 인식 후 `figcaption`으로 출력

## Next Action Item
- 이미지가 문단 중간에 올 때(텍스트 + 이미지 혼합 라인) 레이아웃 정책 확정
- 필요 시 이미지 크기 옵션(예: `=600x`) 같은 커스텀 문법 추가 검토
- utterances repo/theme/label을 환경변수 기반으로 분리할지 결정

## 주의사항
- 현재 utterances repo는 `suu3/suu3.github.io`로 고정되어 있습니다.
- 캡션은 Markdown 표준 title 위치를 재활용한 방식(`![alt](src "caption")`)으로 처리합니다.
- 커스텀 경량 파서라서 CommonMark/GFM의 모든 문법(복잡한 중첩 케이스)은 완전 지원하지 않습니다.

## 사용자가 해야할 일
1. `pnpm install`
2. `pnpm build`
3. `pnpm dev`
4. 포스트 상세 페이지에서 확인
   - 댓글(utterances) 섹션이 하단에 노출되는지
   - `![노션 트러블 슈팅](./1.png)` 이미지가 로드되는지
   - 캡션 문법 `![노션 트러블 슈팅](./1.png "노션 트러블 슈팅")` 적용 시 캡션이 보이는지
