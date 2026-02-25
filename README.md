# suu3.github.io (Next.js)

기존 Gatsby 블로그를 Next.js App Router 기반으로 마이그레이션한 버전입니다.

## 실행

```bash
# 1) pnpm 활성화
corepack enable

# 2) (사내망/미러 환경이라면) npm registry 강제 지정
pnpm config set registry https://registry.npmjs.org/

# 3) 설치 및 실행
pnpm install
pnpm dev
```

- 접속: `http://localhost:3000`

## 주요 기능

- 최신 Next.js(App Router) 구조 적용
- Gatsby 레거시 컴포넌트/설정(`src/*`, `gatsby-*.ts(x)`) 제거로 Next.js 전용 구조 정리
- Tailwind CSS v4 기반 UI 스타일링(기존 카드형 디자인 톤 유지)
- 전체 포스트 검색(제목/설명/카테고리/태그)
- 카테고리 모아보기 및 카테고리별 포스트 목록
- PWA 메타데이터/manifest 및 favicon 연결

## 빌드

```bash
pnpm build
```

정적 배포를 위해 `next.config.ts`에서 `output: 'export'`를 사용합니다.

## 실행이 안 될 때

- `ERR_PNPM_FETCH_403`가 나면, 프로젝트 또는 전역 `.npmrc`에 사설 레지스트리 설정이 있는지 확인하세요.
- 아래 명령으로 현재 레지스트리를 확인/초기화할 수 있습니다.

```bash
pnpm config get registry
pnpm config set registry https://registry.npmjs.org/
```


## 배포

GitHub Actions `deploy.yml`은 Next.js 정적 출력 폴더인 `out/`를 배포합니다.
정적 에셋은 Next.js 표준 위치인 `public/` 디렉터리를 사용합니다.
