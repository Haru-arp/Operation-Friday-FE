# Operation Friday - Frontend

개인 재정 관리를 위한 스마트 가계부 프로젝트 Friday의 프론트 레포지토리 입니다.

## 🚀 주요 기능

- **대시보드**: 월별 수입/지출 현황, 자산 현황, 차트 분석
- **거래 관리**: 수입, 지출, 이체 거래 입력 및 관리
- **계정 관리**: 자산, 부채, 수익, 비용 계정 관리
- **인증 시스템**: JWT 기반 로그인/회원가입, 자동 토큰 갱신
- **PWA 지원**: 모바일 앱처럼 설치 가능
- **다크 모드**: 라이트/다크 테마 지원

## 🛠 기술 스택

### Core

- **React 19** -
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Shad CN** - 디자인 시스템
- **tailwind Css** - Css 라이브러리

### State Management

- **Zustand** - 상태 관리
- **TanStack Query** - 서버 상태 관리

### UI/UX

- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성 높은 UI 컴포넌트
- **Lucide React** - 아이콘
- **Recharts** - 차트 라이브러리
- **Sonner** - 토스트 알림

### HTTP & Auth

- **Axios** - HTTP 클라이언트
- **JWT** - 인증 토큰 관리

### PWA

- **Vite PWA Plugin** - Progressive Web App 기능

## 📁 프로젝트 구조

```
src/
├── api/           # API 호출 함수들
├── components/    # 재사용 가능한 UI 컴포넌트
├── constants/     # 상수 정의
├── hook/          # 커스텀 훅
├── layout/        # 레이아웃 컴포넌트
├── lib/           # 유틸리티 함수
├── pages/         # 페이지 컴포넌트
├── routes/        # 라우터 설정
├── stores/        # Zustand 스토어
├── styles/        # 글로벌 스타일
├── types/         # TypeScript 타입 정의
└── utils/         # 헬퍼 함수
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**

```bash
npm install
```

2. **환경변수 설정**
   `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_BASE_URL=https://your-api-server.com
```

3. **개발 서버 실행**

```bash
npm run dev
```

4. **빌드**

```bash
npm run build
```

## 🔧 주요 기능 설명

### 인증 시스템

- JWT 기반 액세스/리프레시 토큰
- 자동 토큰 갱신 (Axios 인터셉터)
- 쿠키 기반 토큰 저장

### 거래 관리

- 복식부기 기반 거래 입력
- 수입/지출/이체 분류
- 계정별 거래 내역 조회

### 대시보드

- 월별 수입/지출 추이 차트
- 카테고리별 지출 분포
- 주요 재정 지표 요약

### PWA 기능

- 오프라인 지원
- 모바일 앱 설치 가능
- 푸시 알림 (향후 지원 예정)

## 📱 반응형 디자인

- **모바일 우선** 설계(설계중)
- **태블릿/데스크톱** 최적화
- **다크 모드** 지원

## 🔒 보안

- **XSS 방지**: React의 기본 보안 기능 활용
- **CSRF 방지**: SameSite 쿠키 설정
- **HTTPS 강제**: Secure 쿠키 플래그

## 🧪 개발 도구

- **ESLint**: 코드 품질 관리
- **TypeScript**: 타입 안전성
- **Vite HMR**: 빠른 개발 경험

## 📄 라이선스

이 프로젝트는 El-Psy-Congaroo 팀의 사이드 프로젝트입니다.

**Operation Friday** - 개인 재정 관리를 더 스마트하게 💰
