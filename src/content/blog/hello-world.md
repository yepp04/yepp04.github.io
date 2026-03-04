---
title: "Astro로 GitHub Pages 블로그 만들기"
description: "정적 사이트 생성기 Astro를 활용해 GitHub Pages에 기술 블로그를 구축한 과정을 공유합니다."
date: "2026-03-04"
tags: ["astro", "블로그", "github-pages"]
draft: false
---

## 왜 Astro를 선택했나

블로그를 만들기 위해 여러 선택지를 검토했습니다.

- **Next.js**: SSR/SSG 모두 가능하지만, 블로그치고는 오버스펙
- **Gatsby**: 플러그인 생태계가 좋지만 빌드가 느림
- **Astro**: 콘텐츠 중심 사이트에 최적화, 빠른 빌드, 제로 JS 기본

Astro는 마크다운 기반 콘텐츠를 다루는 데 최적화되어 있고, 기본적으로 클라이언트 사이드 JavaScript를 전혀 보내지 않아 성능이 뛰어납니다.

## 프로젝트 구조

```bash
src/
├── components/    # 재사용 컴포넌트
├── content/blog/  # 마크다운 글
├── layouts/       # 페이지 레이아웃
├── pages/         # 라우팅
└── styles/        # 전역 스타일
```

## Content Collections

Astro의 Content Collections API를 사용하면 마크다운 파일의 프론트매터를 타입 안전하게 관리할 수 있습니다.

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

## GitHub Pages 배포

GitHub Actions를 활용하면 `main` 브랜치에 push할 때마다 자동으로 빌드 및 배포됩니다.

## 마무리

Astro는 블로그와 같은 콘텐츠 중심 사이트에 최적의 선택입니다. 빠른 빌드 속도, 타입 안전한 콘텐츠 관리, 그리고 뛰어난 성능을 제공합니다.

다음 글에서는 다크 미니멀 디자인 시스템을 적용한 과정을 다루겠습니다.
