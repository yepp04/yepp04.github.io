---
title: "Astro로 GitHub Pages 블로그 만들기"
description: "정적 사이트 생성기 Astro를 활용해 GitHub Pages에 기술 블로그를 구축한 과정을 공유합니다."
date: "2026-03-04T10:00:00"
tags: ["astro", "블로그", "github-pages"]
draft: false
---

## 블로그를 만들게 된 계기

개발자라면 한 번쯤 자신만의 기술 블로그를 가지고 싶다는 생각을 합니다. 면접에서 "블로그 하세요?"라는 질문을 받을 때, 깔끔하게 정리된 블로그 링크를 건넬 수 있다면 그것만으로도 좋은 인상을 줄 수 있죠.

기존에는 velog나 티스토리 같은 플랫폼을 사용할 수도 있지만, 직접 블로그를 만들면 몇 가지 장점이 있습니다.

- **커스터마이징 자유도**: 디자인, 기능, SEO 설정을 100% 제어 가능
- **포트폴리오 효과**: "이 블로그 자체가 제가 만든 프로젝트입니다"
- **AdSense 수익**: 트래픽이 쌓이면 부수입도 가능
- **기술력 증명**: 정적 사이트 생성, CI/CD, SEO 등 실무 역량을 자연스럽게 보여줌

## 왜 Astro를 선택했나

블로그를 만들기 위해 여러 선택지를 검토했습니다.

| 프레임워크 | 장점 | 단점 | 블로그 적합도 |
|-----------|------|------|-------------|
| **Next.js** | SSR/SSG 모두 가능, 거대한 생태계 | 블로그치고 오버스펙, 번들 크기 큼 | ★★★☆☆ |
| **Gatsby** | 플러그인 풍부, GraphQL 데이터 레이어 | 빌드 느림, 러닝커브 높음 | ★★★☆☆ |
| **Hugo** | 빌드 극히 빠름 | Go 템플릿 문법이 난해 | ★★★★☆ |
| **Astro** | 콘텐츠 최적화, 제로 JS 기본, 빠른 빌드 | 상대적으로 젊은 생태계 | ★★★★★ |

Astro를 선택한 결정적인 이유는 **"Islands Architecture"** 때문입니다. Astro는 기본적으로 클라이언트에 JavaScript를 전혀 보내지 않고, 필요한 컴포넌트만 선택적으로 하이드레이션합니다. 블로그처럼 대부분 정적인 콘텐츠를 다루는 사이트에서는 이것이 엄청난 성능 이점을 가져옵니다.

```
# Lighthouse 점수 비교 (개인 테스트 기준)
Next.js 블로그:  Performance 82 | Accessibility 95 | SEO 92
Astro 블로그:    Performance 100 | Accessibility 100 | SEO 100
```

## 프로젝트 구조

실제로 구성한 프로젝트 구조입니다.

```bash
src/
├── components/
│   ├── Header.astro        # 네비게이션 (로고, Blog, GitHub 링크)
│   ├── Footer.astro        # 카피라이트
│   └── PostCard.astro      # 목록 페이지 글 카드
├── content/
│   └── blog/               # 마크다운 글 저장 폴더
│       └── *.md
├── layouts/
│   ├── BaseLayout.astro    # 공통 레이아웃 (head, header, footer)
│   └── PostLayout.astro    # 글 상세 레이아웃
├── pages/
│   ├── index.astro         # / → /blog 리다이렉트
│   └── blog/
│       ├── index.astro     # 블로그 목록
│       └── [...slug].astro # 블로그 상세 (동적 라우팅)
└── styles/
    └── global.css          # 전역 스타일 (다크 미니멀)
```

핵심은 `content/blog/` 폴더에 마크다운 파일만 추가하면 자동으로 글이 생성된다는 점입니다. 빌드 시스템이나 라우팅 코드를 건드릴 필요가 없습니다.

## Content Collections: 타입 안전한 콘텐츠 관리

Astro v5의 Content Collections API를 사용하면 마크다운 파일의 프론트매터를 Zod 스키마로 검증할 수 있습니다. 잘못된 날짜 형식이나 누락된 필드를 빌드 타임에 잡아줍니다.

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

이렇게 설정해두면 마크다운 파일의 프론트매터가 스키마에 맞지 않을 때 빌드가 실패하면서 정확한 에러 메시지를 보여줍니다. 예를 들어 `date` 필드를 빼먹으면:

```
[ERROR] "date" is required in blog/some-post.md
```

타입스크립트를 쓰는 프로젝트라면 이 안전장치가 정말 유용합니다.

## 다크 미니멀 디자인 시스템

블로그 디자인은 "읽기에 집중할 수 있는 환경"을 목표로 했습니다. 화려한 애니메이션보다는 깔끔한 타이포그래피와 충분한 여백에 신경 썼습니다.

```css
:root {
  --bg: #0a0a0c;        /* 배경: 순수 검정보다 약간 부드럽게 */
  --bg-card: #111115;   /* 카드/코드블록 배경 */
  --text: #e4e4e7;      /* 본문: 눈이 편한 밝기 */
  --text-muted: #71717a; /* 보조 텍스트 */
  --accent: #22d3ee;    /* 강조색: 시안 */
  --border: #27272a;    /* 구분선 */
}
```

폰트 선택도 중요했습니다.

- **제목**: Playfair Display — 세리프체로 글의 품격을 높임
- **본문**: Noto Sans KR — 한국어 가독성 최고, 300/400/600 웨이트 활용
- **코드**: JetBrains Mono — 개발자 블로그에 어울리는 모노스페이스 폰트

콘텐츠 영역의 최대 너비는 720px로 설정했습니다. 이는 한 줄에 약 45~75자가 들어가는 최적의 가독성 범위입니다.

## GitHub Pages 배포: 자동화의 힘

GitHub Actions를 활용하면 `main` 브랜치에 push만 하면 빌드부터 배포까지 자동으로 이루어집니다.

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

이 워크플로우의 작동 방식:

1. `main` 브랜치에 push 감지
2. Node.js 20 환경에서 의존성 설치 및 빌드
3. 빌드 결과물(`dist/`)을 Pages 아티팩트로 업로드
4. GitHub Pages 환경에 배포

전체 배포 시간은 약 30초 내외입니다. 글 하나 쓰고 `git push`하면 1분도 안 돼서 라이브에 반영됩니다.

## SEO 설정: 검색에 노출되게 하기

블로그를 만들었으면 사람들이 찾을 수 있어야 합니다. 기본적인 SEO 설정을 해두었습니다.

- **페이지별 메타 태그**: `<title>`, `<meta description>` 동적 생성
- **Open Graph 태그**: SNS에 공유할 때 제목, 설명, 이미지 노출
- **Canonical URL**: 중복 콘텐츠 방지
- **사이트맵**: `@astrojs/sitemap`으로 자동 생성
- **RSS 피드**: `@astrojs/rss`로 구독 기능 지원
- **robots.txt**: 크롤러 안내

추후 Google Search Console에 사이트맵을 등록하면 검색 노출이 시작됩니다.

## 글 작성 워크플로우

새 글을 쓰는 과정은 매우 간단합니다.

```bash
# 1. 마크다운 파일 생성
touch src/content/blog/my-new-post.md

# 2. 프론트매터 + 내용 작성
# 3. 로컬에서 확인
npm run dev

# 4. 배포
git add .
git commit -m "새 글: 제목"
git push
```

프론트매터 템플릿:

```yaml
---
title: "글 제목"
description: "한 줄 설명"
date: "2026-03-04"
tags: ["태그1", "태그2"]
draft: false    # true로 설정하면 빌드에서 제외
---
```

`draft: true`로 설정하면 로컬에서는 보이지만 배포 시 제외됩니다. 작성 중인 글을 push해도 안전합니다.

## 마무리

Astro + GitHub Pages 조합은 기술 블로그에 최적의 선택이라고 생각합니다.

- **비용**: 무료 (GitHub Pages 호스팅)
- **성능**: Lighthouse 100점 (제로 JS 기본)
- **관리**: 마크다운만 쓰면 됨
- **배포**: `git push`하면 끝
- **확장성**: 필요할 때 React/Vue 컴포넌트 추가 가능

이 블로그의 전체 소스 코드는 [GitHub 저장소](https://github.com/yepp04/yepp04.github.io)에서 확인할 수 있습니다. 비슷한 블로그를 만들고 싶다면 fork해서 사용하셔도 좋습니다.

다음 글에서는 실제 프로젝트에서의 경험을 다룰 예정입니다. 기대해 주세요!
