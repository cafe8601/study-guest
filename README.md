# Study Quest - AI 기반 학습 플랫폼

재수생의 막연한 목표를 AI가 실행 가능한 일일 퀘스트로 변환하는 학습 플랫폼입니다.

## 주요 기능

- **AI 자동 목표 분해**: 장기 목표를 구체적인 일일 학습 퀘스트로 자동 변환
- **AI 캐릭터 동반자**: 멘토형, 친구형, 하이브리드형 3가지 캐릭터 선택 가능
- **실시간 채팅**: OpenAI GPT-4를 활용한 실시간 학습 상담
- **진도 추적**: 일일 퀘스트 완료율 및 학습 진행 상황 시각화
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경에서 최적화

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **AI**: OpenAI GPT-4 API
- **State Management**: React Context API

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/yourusername/study-quest.git
cd study-quest
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 입력하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일 내용:

```env
# OpenAI API Key (필수)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**OpenAI API Key 발급 방법:**
1. [OpenAI Platform](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 메뉴에서 새 API 키 생성
4. 생성된 키를 복사하여 `.env.local`의 `OPENAI_API_KEY`에 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
study-quest/
├── app/                      # Next.js App Router
│   ├── api/                 # API 라우트
│   │   ├── chat/           # 채팅 API
│   │   └── generate-plan/  # 학습 계획 생성 API
│   ├── chat/               # 채팅 페이지
│   ├── dashboard/          # 대시보드 페이지
│   ├── onboarding/         # 온보딩 페이지
│   └── layout.tsx          # 루트 레이아웃
├── components/             # React 컴포넌트
│   ├── chat/              # 채팅 관련 컴포넌트
│   ├── dashboard/         # 대시보드 컴포넌트
│   ├── landing/           # 랜딩 페이지 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── onboarding/        # 온보딩 컴포넌트
│   └── ui/                # shadcn/ui 컴포넌트
├── lib/                   # 유틸리티 및 라이브러리
│   └── contexts/         # React Context
└── public/               # 정적 파일

```

## 주요 페이지

- **랜딩 페이지 (`/`)**: 서비스 소개 및 시작하기
- **온보딩 (`/onboarding`)**: 목표 설정 및 학습 계획 생성
- **대시보드 (`/dashboard`)**: 일일 퀘스트 및 진도 확인
- **AI 멘토 (`/chat`)**: AI 캐릭터와 실시간 대화

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 실행
npm run lint
```

## 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 환경 변수 설정 (`OPENAI_API_KEY`)
4. 자동 배포 완료

## 라이선스

MIT License

## 기여하기

이슈 및 풀 리퀘스트를 환영합니다!

## 지원

문제가 발생하면 [Issues](https://github.com/yourusername/study-quest/issues)에 등록해주세요.
