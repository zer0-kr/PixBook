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

## 로컬 개발 환경 설정

### 1. 사전 요구사항

- **Node.js** >= 20
- **npm** (package-lock.json 사용)
- [Supabase](https://supabase.com) 계정 및 프로젝트
- [알라딘 TTB API](https://www.aladin.co.kr/ttb/wblog_manage.aspx) 키

### 2. 클론 및 의존성 설치

```bash
git clone https://github.com/zer0-kr/PixBook.git
cd PixBook
npm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 아래 값을 채워주세요:

```bash
# Supabase Dashboard > Settings > API 에서 확인
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...      # anon (public) 키
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...           # service_role 키 (서버 전용)

# 알라딘 TTB API 키
# https://www.aladin.co.kr/ttb/wblog_manage.aspx 에서 발급
ALADIN_TTB_KEY=ttbYourKey...

# 앱 기본 URL (로컬 개발 시)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

| 변수 | 어디서 얻나요? | 용도 |
|------|----------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | DB/인증 연결 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 페이지의 `anon` `public` 키 | 브라우저 측 Supabase 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 같은 페이지의 `service_role` 키 | 서버 측 관리자 작업 (도서 데이터 보강) |
| `ALADIN_TTB_KEY` | [알라딘 API 포털](https://www.aladin.co.kr/ttb/wblog_manage.aspx) | 도서 검색/조회 |
| `NEXT_PUBLIC_BASE_URL` | 직접 설정 | OAuth 콜백 리다이렉트 URL |

### 4. 데이터베이스 설정

#### 방법 A: Supabase CLI (권장)

```bash
# Supabase CLI 설치 (아직 없다면)
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push

# 캐릭터 시드 데이터 삽입
supabase db execute -f supabase/seed.sql
```

#### 방법 B: Supabase Dashboard

Supabase Dashboard > **SQL Editor**에서 아래 파일들을 순서대로 실행:

| 순서 | 파일 | 내용 |
|------|------|------|
| 1 | `00001_initial_schema.sql` | 테이블, ENUM, 인덱스, RLS 정책 생성 |
| 2 | `00002_security_hardening.sql` | 보안 강화 (권한 정리) |
| 3 | `00003_rpc_functions.sql` | RPC 함수 (타워 높이 재계산 등) |
| 4 | `00005_rating_half_star.sql` | 별점 0.5단위 지원 |
| 5 | `00006_character_redesign.sql` | 캐릭터 데이터 구조 변경 |
| 6 | `00007_remove_active_character.sql` | 대표 캐릭터 시스템 제거 |
| 7 | `00008_realistic_tower_height.sql` | 타워 높이 계산 보정 |
| 8 | `seed.sql` | 캐릭터 56종 시드 데이터 |

### 5. Supabase 인증 설정

#### 이메일 인증 (기본)

Supabase Dashboard > **Authentication** > **Providers** > Email 활성화 (기본 활성화됨)

#### Google OAuth (선택)

1. [Google Cloud Console](https://console.cloud.google.com) > **API 및 서비스** > **사용자 인증 정보**
2. **OAuth 클라이언트 ID** 생성 (웹 애플리케이션)
3. 승인된 리디렉션 URI 추가:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Supabase Dashboard > **Authentication** > **Providers** > Google 활성화
5. Client ID와 Client Secret 입력

### 6. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

---

## 프로덕션 배포 (Vercel)

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에서 **New Project** > GitHub 레포 연결
2. Framework Preset: **Next.js** (자동 감지)

### 2. 환경변수 설정

Vercel Dashboard > **Settings** > **Environment Variables**에 아래 값 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALADIN_TTB_KEY=your-aladin-ttb-key
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

> `NEXT_PUBLIC_BASE_URL`은 Vercel이 부여한 도메인 또는 커스텀 도메인으로 설정합니다.

### 3. Supabase 리다이렉트 URL 추가

Supabase Dashboard > **Authentication** > **URL Configuration**:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**에 추가: `https://your-domain.vercel.app/callback`

### 4. 배포

`main` 브랜치에 push하면 자동으로 프로덕션 배포됩니다.

---

## 프로젝트 구조

```
src/
├── app/                # Next.js App Router (페이지 & API)
│   ├── (auth)/        #   로그인/회원가입
│   ├── (main)/        #   메인 앱 (서재, 통계, 타워 등)
│   └── api/           #   API 라우트 (도서 검색, 임포트/엑스포트)
├── components/         # React 컴포넌트
│   ├── ui/            #   공통 UI (PixelButton, PixelModal 등)
│   ├── library/       #   서재
│   ├── book/          #   도서 상세
│   ├── tower/         #   독서 타워
│   ├── characters/    #   캐릭터 도감
│   └── stats/         #   통계
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 & 서버 로직
│   ├── supabase/      #   Supabase 클라이언트 (client/server/middleware)
│   ├── aladin/        #   알라딘 API 연동
│   └── actions/       #   Server Actions
└── types/              # TypeScript 타입 정의

supabase/
├── migrations/         # DB 마이그레이션 (7개)
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
| `npm run test:e2e` | Playwright E2E 테스트 (headless) |
| `npm run test:e2e:headed` | 브라우저 UI로 E2E 테스트 |

---

## 라이선스

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — 비상업적 목적으로 자유롭게 사용할 수 있으며, 수정 시 동일 라이선스로 공유해야 합니다.
