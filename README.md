# 픽북 (PixBook)

**나만의 독서 타워**

책을 읽고 기록하면 타워가 쌓이고, 캐릭터를 수집하는 게이미피케이션 독서 앱.
알라딘 API 기반 한국어 독서 기록 서비스입니다.

[pixbook.vercel.app](https://book-log-khaki.vercel.app)

---

## 주요 기능

### 서재 관리

- 알라딘 도서 검색 및 등록
- 독서 상태 추적 (읽고 싶은 / 읽는 중 / 다 읽은)
- 별점 및 한줄평 기록
- 북적북적 CSV 임포트

### 독서 타워

- 읽은 페이지가 타워 높이로 변환 (0.06cm/페이지)
- cm → m → km 마일스톤 달성 시스템

### 캐릭터 수집

- 56종 픽셀아트 캐릭터
- 4단계 레어리티: Common / Rare / Epic / Legendary
- 타워 높이 기반 해금

### 독서 통계

- 월별 독서량 추이
- 장르 분포
- 독서 캘린더 히트맵

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| External API | 알라딘 TTB API |
| Testing | Playwright E2E |
| Deploy | Vercel |

