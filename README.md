# 깃냥이.DEV

개발 블로그 — [yepp04.github.io](https://yepp04.github.io)

## Stack

- [Astro](https://astro.build) (정적 사이트 생성기)
- GitHub Pages + GitHub Actions (자동 배포)

## 구조

```
src/
├── content/blog/   # 블로그 글 (마크다운)
├── pages/          # 페이지 (index, about, contact, privacy, 404)
├── components/     # Header, Footer, PostCard 등
├── layouts/        # BaseLayout, PostLayout
└── styles/         # global.css
```

## 글 작성

`src/content/blog/`에 마크다운 파일 추가 후 push하면 자동 배포됩니다.

```yaml
---
title: "글 제목"
description: "한 줄 설명"
date: "2026-03-05"
tags: ["태그1", "태그2"]
image: "/images/썸네일.webp"  # 선택
draft: false
---
```

## 로컬 개발

```sh
npm install
npm run dev     # localhost:4321
npm run build   # 빌드
```
