<div align="center">

# 📚 PixBook

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3fcf8e?logo=supabase)](https://supabase.com/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**나만의 독서 타워를 쌓고, 픽셀 캐릭터를 수집하는 게이미피케이션 독서 앱**

<!-- 스크린샷이나 데모 GIF가 생기면 아래에 추가
<br>
<img src=".github/demo.gif" alt="PixBook 데모" width="720" />
-->

</div>

<br>

---

## 하이라이트

- **독서 타워** — 읽은 페이지가 실제 높이(cm)로 변환되어 타워로 쌓임. 마일스톤 달성 시스템 포함
- **캐릭터 수집** — 62종 픽셀아트 캐릭터, 4단계 레어리티 (Common · Rare · Epic · Legendary). 타워 높이에 따라 해금
- **서재 관리** — 알라딘 API 기반 도서 검색, 독서 상태 추적, 0.5단위 별점, 한줄평
- **독서 통계** — 월별 독서량, 장르 분포, 독서 캘린더 히트맵

---

## 주요 기능

<table>
<tr>
<td width="33%" valign="top">

**🏗️ 독서 타워**

그라데이션 하늘, 픽셀 구름, 책등 스택. 높이 눈금자와 마일스톤 깃발로 성장을 시각화.

</td>
<td width="33%" valign="top">

**🎮 캐릭터 수집**

62종 픽셀아트 스프라이트. 타워가 높아질수록 새 캐릭터 해금. 레어리티별 발광 효과.

</td>
<td width="33%" valign="top">

**📖 서재 관리**

알라딘 API로 도서 검색/등록. 읽는 중·완독·읽고 싶은 상태 추적. 별점 및 한줄평.

</td>
</tr>
<tr>
<td valign="top">

**📊 독서 통계**

월별 독서량 차트, 장르 분포, 연간 캘린더 히트맵. 독서 패턴을 한눈에 파악.

</td>
<td valign="top">

**🔐 인증**

이메일 + Google OAuth. Supabase Auth 기반. Row Level Security로 데이터 보호.

</td>
<td valign="top">

**🎨 픽셀아트 테마**

커스텀 픽셀 폰트, 레트로 UI 컴포넌트, 캐릭터 해금 애니메이션. 일관된 8-bit 미학.

</td>
</tr>
</table>

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), TypeScript, [Tailwind CSS v4](https://tailwindcss.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Row Level Security) |
| External API | [알라딘 TTB API](https://www.aladin.co.kr/ttb/wblog_manage.aspx) |
| Testing | [Playwright](https://playwright.dev/) E2E |
| Deploy | [Vercel](https://vercel.com/) |

---

## 시작하기

### 사전 요구사항

- **Node.js** >= 20
- **npm** (package-lock.json 사용)
- [Supabase](https://supabase.com) 계정 및 프로젝트
- [알라딘 TTB API](https://www.aladin.co.kr/ttb/wblog_manage.aspx) 키

### 클론 및 실행

```bash
git clone https://github.com/zer0-kr/PixBook.git
cd PixBook
npm install
cp .env.example .env.local
# .env.local 파일에 환경변수 입력 후:
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

<details>
<summary><strong>환경변수 상세</strong></summary>

```bash
# Supabase Dashboard > Settings > API 에서 확인
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...      # anon (public) 키
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...           # service_role 키 (서버 전용)

# 알라딘 TTB API 키
ALADIN_TTB_KEY=ttbYourKey...

# 앱 기본 URL (로컬 개발 시)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

| 변수 | 어디서 얻나요? | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | DB/인증 연결 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 페이지의 `anon` `public` 키 | 브라우저 측 Supabase 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 같은 페이지의 `service_role` 키 | 서버 측 관리자 작업 (도서 데이터 보강) |
| `ALADIN_TTB_KEY` | [알라딘 API 포털](https://www.aladin.co.kr/ttb/wblog_manage.aspx) | 도서 검색/조회 |
| `NEXT_PUBLIC_BASE_URL` | 직접 설정 | OAuth 콜백 리다이렉트 URL |

</details>

<details>
<summary><strong>데이터베이스 설정</strong></summary>

#### 방법 A: Supabase CLI (권장)

```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
supabase db execute -f supabase/seed.sql
```

#### 방법 B: Supabase Dashboard

Supabase Dashboard > **SQL Editor**에서 아래 파일들을 순서대로 실행:

| 순서 | 파일 | 내용 |
|:---:|---|---|
| 1 | `00001_initial_schema.sql` | 테이블, ENUM, 인덱스, RLS 정책 생성 |
| 2 | `00002_security_hardening.sql` | 보안 강화 (권한 정리) |
| 3 | `00003_rpc_functions.sql` | RPC 함수 (타워 높이 재계산 등) |
| 4 | `00005_rating_half_star.sql` | 별점 0.5단위 지원 |
| 5 | `00006_character_redesign.sql` | 캐릭터 데이터 구조 변경 |
| 6 | `00007_remove_active_character.sql` | 대표 캐릭터 시스템 제거 |
| 7 | `00008_realistic_tower_height.sql` | 타워 높이 계산 보정 |
| 8 | `seed.sql` | 캐릭터 62종 시드 데이터 |

</details>

<details>
<summary><strong>인증 설정</strong></summary>

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

</details>

<details>
<summary><strong>프로덕션 배포 (Vercel)</strong></summary>

#### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에서 **New Project** > GitHub 레포 연결
2. Framework Preset: **Next.js** (자동 감지)

#### 2. 환경변수 설정

Vercel Dashboard > **Settings** > **Environment Variables**에 아래 값 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALADIN_TTB_KEY=your-aladin-ttb-key
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

#### 3. Supabase 리다이렉트 URL 추가

Supabase Dashboard > **Authentication** > **URL Configuration**:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**에 추가: `https://your-domain.vercel.app/callback`

#### 4. 배포

`main` 브랜치에 push하면 자동으로 프로덕션 배포됩니다.

</details>

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
└── seed.sql            # 캐릭터 시드 데이터 (62종)

e2e/                    # Playwright E2E 테스트
```

---

## 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test:e2e` | Playwright E2E 테스트 (headless) |
| `npm run test:e2e:headed` | 브라우저 UI로 E2E 테스트 |

---

## 라이선스

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — 비상업적 목적으로 자유롭게 사용할 수 있으며, 수정 시 동일 라이선스로 공유해야 합니다.

---

<div align="center">

**이 프로젝트가 마음에 드셨다면 스타를 눌러주세요!**

[![Star on GitHub](https://img.shields.io/github/stars/zer0-kr/PixBook?style=social)](https://github.com/zer0-kr/PixBook)

</div>
