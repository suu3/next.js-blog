# 작업 진행상황 (Build Error Fix)

## 진행상황
- `npm run build`로 빌드 에러를 재현했습니다.
- 원인: 클라이언트 컴포넌트(`components/post-search.tsx`)가 `node:fs`, `node:path`를 사용하는 `lib/posts.ts`를 참조하고 있었습니다.
- 대응: 슬러그 유틸을 `lib/slug.ts`로 분리하고, 클라이언트/카테고리 페이지 import를 분리했습니다.
- 검증: `npm run build` 재실행 시 빌드가 정상 통과했습니다.

## Next Action Item
- CI 환경에서 동일 커밋 기준 `npm run build` 재검증.
- ESLint 설정 파일 추가 후 비대화형 lint 명령(`eslint .`)으로 전환.

## 주의사항
- `node:*` 모듈을 import 하는 파일은 클라이언트 컴포넌트에서 직접/간접 참조하지 않도록 유지해야 합니다.
- 공용 유틸은 런타임(클라이언트/서버) 의존성을 고려해 별도 모듈로 분리하는 것이 안전합니다.
- 현재 `npm run lint`는 ESLint 초기 설정 프롬프트를 띄워 CI에서 바로 사용하기 어렵습니다.

## 사용자가 해야할 일
- 변경사항 pull 후 CI에서 `npm run build`가 통과하는지 확인해주세요.
- ESLint를 이미 사용 중이라면 저장소에 eslint 설정 파일을 커밋해 비대화형 lint가 가능하도록 맞춰주세요.
- 배포 파이프라인에 캐시가 남아 있으면 클린 빌드로 1회 확인해주세요.
