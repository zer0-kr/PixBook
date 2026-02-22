# 픽북 (PixBook)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**나만의 독서 타워** — 책을 읽고 기록하면 타워가 쌓이고, 캐릭터를 수집하는 게이미피케이션 독서 앱

알라딘 API 기반 한국어 독서 기록 서비스입니다.

---

## 주요 기능

- **서재 관리** — 도서 검색/등록, 독서 상태 추적, 별점 및 한줄평
- **독서 타워** — 읽은 페이지가 타워 높이로 변환, 마일스톤 달성 시스템
- **캐릭터 수집** — 56종 픽셀아트 캐릭터, 4단계 레어리티 (Common / Rare / Epic / Legendary)
- **독서 통계** — 월별 독서량, 장르 분포, 독서 캘린더 히트맵

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| External API | 알라딘 TTB API |
| Testing | Playwright E2E |
| Deploy | Vercel |

---

## Getting Started

### 사전 요구사항

- Node.js >= 20
- [Supabase](https://supabase.com) 프로젝트
- [알라딘 TTB API](https://www.aladin.co.kr/ttb/wblog_manage.aspx) 키

### 설치

```bash
git clone https://github.com/zer0-kr/PixBook.git
cd PixBook
npm install
```

### 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 아래 값을 채워주세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALADIN_TTB_KEY=your-aladin-ttb-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 데이터베이스 설정

Supabase CLI 또는 대시보드에서 마이그레이션과 시드 데이터를 실행합니다:

```bash
# Supabase CLI 사용 시
supabase db push

# 캐릭터 시드 데이터
# Supabase Dashboard > SQL Editor에서 supabase/seed.sql 실행
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

---

## 프로젝트 구조

```
src/
├── app/                # Next.js App Router (페이지 & API)
├── components/         # React 컴포넌트
│   ├── ui/            #   공통 UI (PixelButton, PixelModal 등)
│   ├── library/       #   서재
│   ├── book/          #   도서 상세
│   ├── tower/         #   독서 타워
│   ├── characters/    #   캐릭터 도감
│   └── stats/         #   통계
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 & 서버 로직
│   ├── supabase/      #   Supabase 클라이언트
│   ├── aladin/        #   알라딘 API
│   └── actions/       #   Server Actions
└── types/              # TypeScript 타입 정의

supabase/
├── migrations/         # DB 마이그레이션 (8개)
└── seed.sql            # 캐릭터 시드 데이터 (56종)

e2e/                    # Playwright E2E 테스트
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test:e2e` | Playwright E2E 테스트 |
| `npm run test:e2e:headed` | 브라우저 UI로 E2E 테스트 |

---

## 라이선스

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — 비상업적 목적으로 자유롭게 사용할 수 있으며, 수정 시 동일 라이선스로 공유해야 합니다.
