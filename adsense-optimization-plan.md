# 깃냥이.DEV 애드센스 최적화 계획서

> 작성일: 2026-03-04
> 참고: [Google 애드센스 공식 블로그 - 고품질 사이트](https://adsense-ko.googleblog.com/2012/04/blog-post_25.html), [독창적 콘텐츠 가이드](https://adsense-ko.googleblog.com/2012/09/2.html), [애드센스 광고 배치 권장사항](https://support.google.com/adsense/answer/1282097?hl=en), [가시성 최적화](https://support.google.com/adsense/answer/6219980?hl=en)

---

## 1. 현재 상태 분석

### 1.1 사이트 구조
- **프레임워크**: Astro 5.x (정적 사이트 생성기)
- **배포**: GitHub Pages + GitHub Actions
- **레이아웃**: 단일 컬럼, max-width 720px
- **페이지 구성**: 홈(블로그 목록), 블로그 목록(/blog), 개별 포스트(/blog/:slug), RSS 피드
- **콘텐츠**: 개발 관련 한국어 블로그 글 3개

### 1.2 현재 광고 상태
- AdSense 코드 없음 (BaseLayout.astro, PostLayout.astro에 주석 처리된 placeholder만 존재)
- 광고 슬롯 UI 미구현
- 사이드바 없음 (단일 컬럼 레이아웃)

### 1.3 해결해야 할 과제
- AdSense 승인을 위한 콘텐츠 품질 및 양 확보
- 광고 배치를 위한 레이아웃 확장
- SEO 최적화 (검색 트래픽 = 수익의 기반)
- 모바일/데스크톱 각각에 최적화된 광고 전략

---

## 2. 애드센스 승인 전 준비사항 (Phase 0)

### 2.1 콘텐츠 요건

| 항목 | 현재 | 목표 | 상세 |
|------|------|------|------|
| 글 개수 | 3개 | 최소 15~20개 | 1,500자 이상의 양질의 글 |
| 글 주제 | 개발 일반 | 특정 니치 중심 | 차별화된 독창적 콘텐츠 |
| 글 빈도 | 불규칙 | 주 1~2회 | 꾸준한 업데이트가 승인에 유리 |
| 중복 콘텐츠 | 없음 | 없음 유지 | 다른 사이트 복붙 절대 금지 |

**Google 공식 가이드 핵심 원칙:**
1. **중복 콘텐츠 회피** — 양보다 질, 유사한 페이지 통합
2. **차별화된 독창적 콘텐츠** — 다른 사이트와 차별점 필수
3. **투명한 약속 이행** — 클릭베이트 금지, 명확한 네비게이션

### 2.2 필수 페이지 추가

| 페이지 | 경로 | 설명 | 우선순위 |
|--------|------|------|----------|
| 소개(About) 페이지 | `/about` | 블로그 운영자 소개, 블로그 목적 | 필수 |
| 개인정보처리방침 | `/privacy` | 개인정보 수집/이용 고지 (AdSense 필수) | 필수 |
| 면책조항 | `/disclaimer` | 광고 수익 공개, 책임 제한 | 권장 |
| 연락처/문의 | `/contact` | 이메일 또는 폼 기반 연락 수단 | 권장 |
| 사이트맵 | `/sitemap.xml` | 이미 @astrojs/sitemap으로 생성됨 | 완료 |

### 2.3 SEO 기본 최적화

| 항목 | 현재 상태 | 개선 내용 |
|------|-----------|-----------|
| meta description | 있음 | 각 포스트별 고유 description 유지 |
| OG 태그 | 있음 (기본) | og:image 추가 (대표 이미지) |
| 구조화된 데이터 | 없음 | JSON-LD Article 스키마 추가 |
| canonical URL | 있음 | 유지 |
| robots.txt | 있음 | 유지 |
| Google Search Console | 미확인 | 등록 및 사이트맵 제출 |
| Google 사이트 인증 | 있음 (public/google*.html) | 완료 |

---

## 3. 레이아웃 재설계 (Phase 1)

### 3.1 데스크톱 레이아웃: 콘텐츠 + 사이드바

현재 720px 단일 컬럼에서 콘텐츠+사이드바 2컬럼으로 확장.

```
┌─────────────────────────────────────────────────┐
│                    Header (full-width)           │
├──────────────────────────┬──────────────────────┤
│                          │                      │
│   본문 콘텐츠 (680px)     │  사이드바 (300px)     │
│                          │                      │
│   [광고1: 본문 상단]      │  [광고3: 사이드바 상단]│
│                          │                      │
│   글 내용...              │  [최근 글 목록]       │
│                          │                      │
│   [광고2: 본문 중간]      │  [태그 클라우드]      │
│                          │                      │
│   글 내용 계속...         │  [광고4: 사이드바     │
│                          │   Sticky]            │
│   [광고5: 본문 하단]      │                      │
│                          │                      │
├──────────────────────────┴──────────────────────┤
│                    Footer (full-width)           │
└─────────────────────────────────────────────────┘
```

**CSS 변수 변경:**
```css
:root {
  --max-width: 720px;      /* 현재 */
  --max-width: 1080px;     /* 변경: 콘텐츠 680px + gap 40px + 사이드바 300px */
  --content-width: 680px;
  --sidebar-width: 300px;
}
```

### 3.2 모바일 레이아웃: 단일 컬럼

```
┌──────────────────────┐
│       Header         │
├──────────────────────┤
│                      │
│  [광고1: 본문 상단]   │
│                      │
│  글 내용...           │
│                      │
│  [광고2: 본문 중간]   │
│                      │
│  글 내용 계속...      │
│                      │
│  [광고3: 본문 하단]   │
│                      │
│  [최근 글 / 태그]     │
│                      │
├──────────────────────┤
│       Footer         │
└──────────────────────┘
```

- 사이드바는 본문 아래로 이동 (모바일에서는 광고 미표시 또는 1개만)
- 브레이크포인트: `@media (max-width: 768px)`

### 3.3 구현할 파일 변경 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/styles/global.css` | `--max-width` 확장, 사이드바 관련 CSS 추가 |
| `src/layouts/BaseLayout.astro` | 2컬럼 래퍼 구조 추가 |
| `src/layouts/PostLayout.astro` | 사이드바 슬롯 추가, 광고 슬롯 위치 확정 |
| `src/components/Sidebar.astro` | 새 파일: 사이드바 컴포넌트 (최근 글, 태그, 광고 슬롯) |
| `src/components/AdSlot.astro` | 새 파일: 재사용 가능한 광고 슬롯 컴포넌트 |
| `src/pages/index.astro` | 레이아웃 변경 반영 |
| `src/pages/blog/index.astro` | 레이아웃 변경 반영 |

---

## 4. 광고 배치 전략 (Phase 2)

### 4.1 광고 슬롯 설계

Google 공식 권장사항 기반으로 **페이지당 최대 3~4개** 광고 배치.

#### 블로그 포스트 페이지 (핵심 수익 페이지)

| 슬롯 | 위치 | 광고 유형 | 크기 | 기대 효과 | 모바일 |
|------|------|-----------|------|-----------|--------|
| 광고1 | 본문 상단 (제목 아래, 첫 문단 전) | 디스플레이 | 반응형 | CTR 높음 (Above the fold) | 표시 |
| 광고2 | 본문 중간 (3~4번째 소제목 후) | 인아티클 | 반응형 | 자연스러운 읽기 흐름 | 표시 |
| 광고3 | 사이드바 상단 | 디스플레이 | 300x250 | 데스크톱 가시성 | 숨김 |
| 광고4 | 사이드바 하단 (Sticky) | 디스플레이 | 300x600 | 스크롤 시 지속 노출 | 숨김 |
| 광고5 | 본문 하단 (글 끝) | 디스플레이 | 반응형 | 글 완독 사용자 대상 | 표시 |

#### 블로그 목록 페이지

| 슬롯 | 위치 | 광고 유형 | 크기 |
|------|------|-----------|------|
| 광고1 | 포스트 카드 3~4개 사이 | 인피드 | 반응형 |
| 광고2 | 사이드바 상단 | 디스플레이 | 300x250 |

#### 광고 미배치 페이지 (Google 정책 준수)
- About, Privacy, Disclaimer, Contact 페이지
- 404 에러 페이지
- 콘텐츠가 부족한 페이지

### 4.2 AdSlot 컴포넌트 설계

```astro
---
interface Props {
  slot: string;        // 'post-top' | 'post-mid' | 'post-bottom' | 'sidebar-top' | 'sidebar-sticky' | 'infeed'
  format?: string;     // 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean;
  class?: string;
}
---
```

- 개발 환경에서는 placeholder 박스 표시 (광고 크기 시각화)
- 프로덕션에서만 실제 AdSense 코드 로드
- `loading="lazy"` 적용으로 초기 로딩 속도 보호

### 4.3 자동 인아티클 광고 삽입 (본문 중간)

마크다운 본문에 수동으로 광고를 넣지 않고, **렌더링 후 자동 삽입** 방식 사용:

```javascript
// 클라이언트 사이드: 본문의 h2 태그를 기준으로 광고 자동 삽입
const headings = document.querySelectorAll('.prose h2');
if (headings.length >= 3) {
  const targetHeading = headings[2]; // 3번째 h2 앞에 삽입
  const adElement = createAdElement('post-mid');
  targetHeading.parentNode.insertBefore(adElement, targetHeading);
}
```

---

## 5. 성능 최적화 (Phase 3)

### 5.1 Core Web Vitals 보호

광고는 성능에 직접 영향을 미침. 애드센스 승인 및 SEO 순위에 CWV가 중요.

| 지표 | 목표 | 광고 관련 대책 |
|------|------|---------------|
| LCP (Largest Contentful Paint) | < 2.5s | 광고 스크립트 `async` 로드, Above-the-fold 광고는 최소화 |
| FID/INP (Interaction to Next Paint) | < 200ms | 광고 스크립트가 메인 스레드 차단하지 않도록 |
| CLS (Cumulative Layout Shift) | < 0.1 | 광고 슬롯에 `min-height` 예약 공간 확보 |

### 5.2 광고 슬롯 레이아웃 시프트 방지

```css
.ad-slot {
  min-height: 250px;           /* 광고 로드 전 공간 예약 */
  background: var(--bg-card);  /* 로딩 중 빈 공간 티 안 나게 */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-slot--sidebar {
  min-height: 250px;
}

.ad-slot--sidebar-sticky {
  position: sticky;
  top: 80px;                   /* 헤더 높이 + 여유 */
  min-height: 600px;
}

.ad-slot--horizontal {
  min-height: 90px;
}
```

### 5.3 AdSense 스크립트 로딩 전략

```html
<!-- BaseLayout.astro <head>에 추가 -->
<!-- 1. 메인 AdSense 스크립트: async로 비차단 로드 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX"
  crossorigin="anonymous"></script>

<!-- 2. 개별 광고 유닛: 각 AdSlot 컴포넌트 내부에서 -->
<ins class="adsbygoogle" ... ></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

---

## 6. 콘텐츠 전략 (Phase 4)

### 6.1 고수익 개발 블로그 주제 (CPC 높은 키워드 중심)

| 카테고리 | 예시 주제 | 예상 CPC |
|----------|-----------|----------|
| 클라우드/인프라 | AWS, Docker, Kubernetes 가이드 | 높음 |
| AI/ML | ChatGPT API 활용법, LLM 파인튜닝 | 높음 |
| 개발 도구 | IDE 세팅, CI/CD 파이프라인 | 중간 |
| 프로그래밍 언어 | Python, TypeScript 심화 가이드 | 중간 |
| 커리어 | 개발자 면접 준비, 이력서 작성 | 높음 |

### 6.2 콘텐츠 품질 체크리스트

글 작성 시 매번 확인:
- [ ] 1,500자 이상의 충분한 분량
- [ ] 독창적 내용 (다른 블로그 복사 아님)
- [ ] 명확한 제목과 description
- [ ] 적절한 소제목(h2, h3) 구조
- [ ] 코드 예시 포함 (개발 블로그 차별점)
- [ ] 대표 이미지 또는 다이어그램 포함
- [ ] 내부 링크 (관련 글 연결)
- [ ] 외부 참고 링크 (신뢰도 향상)

### 6.3 트래픽 성장 목표

| 기간 | 글 수 | 예상 일일 PV | 마일스톤 |
|------|-------|-------------|---------|
| 1개월차 | 8~10개 | 50~100 | Google Search Console 등록, 인덱싱 확인 |
| 2개월차 | 15~20개 | 200~500 | AdSense 승인 신청 |
| 3개월차 | 20~25개 | 500~1,000 | 광고 수익 발생 시작 |
| 6개월차 | 35~40개 | 1,000~3,000 | 광고 배치 A/B 테스트 |

---

## 7. 구현 로드맵

### Phase 0: 승인 준비 (1~2주)
- [ ] About 페이지 작성 (`/about`)
- [ ] 개인정보처리방침 페이지 작성 (`/privacy`)
- [ ] 면책조항 페이지 작성 (`/disclaimer`)
- [ ] 연락처 페이지 작성 (`/contact`)
- [ ] 404 페이지 커스텀 작성 (`/404`)
- [ ] Google Search Console 등록 및 사이트맵 제출
- [ ] JSON-LD Article 구조화 데이터 추가
- [ ] og:image 메타 태그 추가
- [ ] 양질의 블로그 글 10개 이상 확보

### Phase 1: 레이아웃 확장 (1주)
- [ ] CSS 변수 확장 (`--max-width`, `--content-width`, `--sidebar-width`)
- [ ] 2컬럼 레이아웃 CSS 작성 (데스크톱: 콘텐츠+사이드바, 모바일: 단일 컬럼)
- [ ] `Sidebar.astro` 컴포넌트 생성 (최근 글, 태그 클라우드)
- [ ] `AdSlot.astro` 컴포넌트 생성 (재사용 가능 광고 슬롯)
- [ ] `PostLayout.astro` 수정 (사이드바 통합)
- [ ] 블로그 목록 페이지에 인피드 광고 슬롯 추가
- [ ] 모바일 반응형 테스트

### Phase 2: AdSense 통합 (승인 후)
- [ ] AdSense 계정 생성 및 사이트 등록
- [ ] `BaseLayout.astro`에 AdSense 메인 스크립트 추가
- [ ] 각 AdSlot에 실제 광고 유닛 코드 삽입
- [ ] 개발/프로덕션 환경 분기 처리
- [ ] 본문 중간 자동 광고 삽입 스크립트 작성
- [ ] CLS 방지용 `min-height` 적용 확인
- [ ] ads.txt 파일 추가 (`public/ads.txt`)

### Phase 3: 최적화 및 모니터링 (지속)
- [ ] Google PageSpeed Insights로 CWV 점검
- [ ] 광고 가시성(Viewability) 모니터링
- [ ] 광고 배치별 수익 분석 (A/B 테스트)
- [ ] 저성과 광고 슬롯 제거 또는 위치 조정
- [ ] 콘텐츠 지속 발행 (주 1~2회)

---

## 8. 정책 준수 체크리스트

절대 해서는 안 되는 것:
- [ ] 자기 광고 직접 클릭 금지
- [ ] 클릭 유도 문구 삽입 금지 ("광고를 클릭해주세요" 등)
- [ ] 콘텐츠 없는 페이지에 광고 배치 금지
- [ ] 404 페이지, 감사 페이지에 광고 금지
- [ ] 광고가 콘텐츠보다 많은 페이지 금지
- [ ] 다른 사이트 콘텐츠 그대로 복사 금지
- [ ] 자동 생성 콘텐츠(스팸성) 금지
- [ ] 성인/폭력/저작권 위반 콘텐츠 금지

---

## 9. 참고 자료

- [Google 애드센스 공식 블로그 - 고품질 사이트 (2012.04)](https://adsense-ko.googleblog.com/2012/04/blog-post_25.html)
- [Google 애드센스 공식 블로그 - 독창적 콘텐츠 (2012.09)](https://adsense-ko.googleblog.com/2012/09/2.html)
- [AdSense 광고 배치 권장사항 (공식)](https://support.google.com/adsense/answer/1282097?hl=en)
- [AdSense 가시성 최적화 (공식)](https://support.google.com/adsense/answer/6219980?hl=en)
- [AdSense 광고 크기 최적화 (공식)](https://support.google.com/adsense/answer/9139818?hl=ko)
- [AdSense 권장사항 (공식)](https://adsense.google.com/intl/ko_kr/start/resources/best-practices-for-google-adsense/)
- [사이트 광고 게재율 최적화 (공식)](https://support.google.com/adsense/answer/7215246?hl=ko)
- [Best AdSense Placements 2025](https://www.monetizemore.com/blog/best-adsense-placements/)
- [구글 애드센스 승인 2026 필수 요건](https://jeff-info.co.kr/sidehustle/google-adsense-approval-2026/)
