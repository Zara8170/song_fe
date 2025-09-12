# 🎵 UtaBox - Music Discovery App

<div align="center">
  <img src="android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" alt="UtaBox Logo" width="120" height="120">
  
  **노래를 찾고, 저장하고, 즐기는 모든 것을 한 곳에서**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.80.0-blue.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
</div>

## 📱 앱 소개

UtaBox는 음악을 사랑하는 사람들을 위한 종합 음악 검색 및 관리 앱입니다. 노래 검색부터 개인 보관함 관리, 맞춤형 추천까지 모든 기능을 제공합니다.

## 🏗️ 전체 시스템 구성

UtaBox 프로젝트는 여러 개의 저장소로 구성된 마이크로서비스 아키텍처입니다.

| 저장소                                                                      | 역할              | 기술 스택                    | 설명                          |
| --------------------------------------------------------------------------- | ----------------- | ---------------------------- | ----------------------------- |
| **[📱 song_fe](https://github.com/Zara8170/song_fe)**                       | 모바일 프론트엔드 | React Native, TypeScript     | 사용자 인터페이스 앱          |
| **[🚀 songs_be](https://github.com/Zara8170/songs_be)**                     | 백엔드 API 서버   | Spring Boot, Java            | 핵심 비즈니스 로직 및 API     |
| **[🔍 song_elasticsearch](https://github.com/Zara8170/song_elasticsearch)** | 검색 엔진         | Elasticsearch, Python        | 노래 검색 및 추천 시스템      |
| **[🤖 song_ai](https://github.com/Zara8170/song_ai)**                       | AI 추천 서버      | Python, OpenAI GPT, RabbitMQ | 지능형 음악 취향 분석 및 추천 |

### 🔗 저장소 간 연결 구조

```
📱 song_fe (React Native)
    ↓ API 호출
🚀 songs_be (Spring Boot)
    ↓ 검색 요청
🔍 song_elasticsearch (Python)
    ↓ AI 추천 요청
🤖 song_ai (Python)
```

### 📋 각 저장소별 주요 기능

#### 📱 [song_fe](https://github.com/Zara8170/song_fe) - 모바일 앱

- 사용자 인터페이스 및 UX
- 노래 검색 및 플레이리스트 관리
- Google 로그인 연동
- 다국어 지원 (한국어/영어)

#### 🚀 [songs_be](https://github.com/Zara8170/songs_be) - 백엔드 API

- RESTful API 제공
- 사용자 인증 및 권한 관리
- 데이터베이스 관리 (MySQL)
- JWT 토큰 기반 보안

#### 🔍 [song_elasticsearch](https://github.com/Zara8170/song_elasticsearch) - 검색 엔진

- Elasticsearch 기반 고속 검색
- 오타 보정 및 초성 검색
- 다국어 검색 지원
- 검색 성능 최적화

#### 🤖 [song_ai](https://github.com/Zara8170/song_ai) - AI 추천

- OpenAI GPT를 활용한 지능형 음악 취향 분석
- RabbitMQ에서 추천 요청을 비동기로 수신 및 처리
- 개인화된 추천 알고리즘 엔진
- 추천 결과를 Redis에 캐시 저장
- APScheduler 기반 정기적 배치 처리 (스케줄링)

### ✨ 주요 기능

- 🔍 **노래 검색**: 제목, 아티스트, 가사로 원하는 노래를 쉽게 찾기
- 📁 **보관함**: 좋아하는 노래들을 플레이리스트로 관리
- ⭐ **노래 추천**: OpenAI GPT 기반 지능형 음악 취향 분석 및 개인화 추천
- 🌐 **다국어 지원**: 한국어/일본어 언어 전환
- 🔐 **사용자 인증**: Google 로그인 지원

## 🛠 기술 스택

### Frontend

- **React Native 0.80.0** - 크로스 플랫폼 모바일 앱 개발
- **TypeScript 5.0.4** - 타입 안전성과 개발 생산성
- **React Navigation 7.x** - 네비게이션 및 라우팅
- **React Native Reanimated** - 고성능 애니메이션

### 상태 관리 & 데이터

- **React Context API** - 전역 상태 관리
- **AsyncStorage** - 로컬 데이터 저장
- **Axios** - HTTP 클라이언트

### UI/UX

- **React Native Vector Icons** - 아이콘 시스템
- **React Native Safe Area Context** - 안전 영역 처리
- **React Native Gesture Handler** - 제스처 처리

### 인증 & 보안

- **Google Sign-In** - 소셜 로그인
- **React Native Encrypted Storage** - 보안 저장소
- **Firebase** - 백엔드 서비스

### AI 추천 & 메시징

- **OpenAI GPT** - 지능형 음악 취향 분석
- **RabbitMQ** - 비동기 메시지 처리
- **APScheduler** - 정기적 배치 스케줄링
- **FastAPI** - AI 서비스 REST API

## 📁 프로젝트 구조

```
src/
├── api/                    # API 통신 관련
│   ├── auth.ts            # 인증 API
│   ├── fetchWithAuth.ts   # 인증이 포함된 HTTP 클라이언트
│   ├── playlist.ts        # 플레이리스트 API
│   └── song.ts            # 노래 검색 API
├── components/            # 재사용 가능한 컴포넌트
│   ├── BaseModal.tsx      # 기본 모달 컴포넌트
│   ├── PlaylistCreateModal.tsx
│   ├── SongListItem.tsx   # 노래 목록 아이템
│   └── ...
├── contexts/              # React Context 상태 관리
│   ├── AuthContext.tsx    # 인증 상태
│   ├── LanguageContext.tsx # 언어 설정
│   └── ToastContext.tsx   # 알림 메시지
├── hooks/                 # 커스텀 훅
│   ├── FavoritesContext.tsx
│   └── useFavorites.ts
├── screens/               # 화면 컴포넌트
│   ├── MainScreen.tsx     # 메인 화면
│   ├── SearchScreen.tsx   # 검색 화면
│   ├── LibraryScreen.tsx  # 보관함 화면
│   └── ...
└── utils/                 # 유틸리티 함수
    ├── tokenStorage.ts    # 토큰 관리
    ├── favoritesStorage.ts # 즐겨찾기 저장
    └── languageStorage.ts # 언어 설정 저장
```

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 18
- React Native CLI
- Android Studio (Android 개발)
- Xcode (iOS 개발)
- Java Development Kit (JDK)

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd song_fe
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **iOS 설정** (iOS 개발 시)

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **환경 변수 설정**

   ```bash
   # .env 파일 생성 후 필요한 API 키 설정
   cp .env.example .env
   ```

5. **앱 실행**

   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # 개발 서버 시작
   npm start
   ```

### 빌드

```bash
# Android APK 빌드
cd android
./gradlew assembleRelease

# iOS 빌드 (Xcode 사용)
```

## 📱 화면 구성

### 메인 화면

- 앱 로고와 환영 메시지
- 3개 주요 기능 메뉴 (노래검색, 보관함, 노래 추천)
- 설정 메뉴 접근

### 노래 검색

- 검색 타입 선택 (제목, 아티스트, 가사)
- 실시간 검색 결과
- 즐겨찾기 추가/제거
- 플레이리스트에 추가

### 노래 추천

- OpenAI GPT 기반 지능형 취향 분석
- 사용자 청취 패턴 학습
- 개인화된 추천 결과 제공
- 비동기 처리로 빠른 응답

### 보관함

- 즐겨찾기 목록
- 플레이리스트 생성/편집/삭제
- 노래 관리 기능

### 설정

- 언어 설정 (한국어/일본어)
- 로그아웃 기능

## 🔧 개발 스크립트

```bash
# 모바일 앱 개발
npm start          # Metro 번들러 시작
npm run android    # Android 앱 실행
npm run ios        # iOS 앱 실행
npm run lint       # ESLint 실행
npm test           # Jest 테스트 실행

# AI 추천 시스템 관리
npm run ai:start       # AI 추천 서버 시작
npm run ai:stop        # AI 추천 서버 중지
npm run ai:test        # AI 모델 테스트
npm run ai:retrain     # 모델 재학습 시작
```

## 🌐 다국어 지원

앱은 한국어와 일본어를 지원하며, 사용자가 실시간으로 언어를 전환할 수 있습니다.

- 한국어 (기본)
- 日本語

## 🔐 인증 시스템

- Google OAuth 2.0 기반 로그인
- JWT 토큰 기반 인증
- 자동 토큰 갱신
- 보안 저장소를 통한 토큰 관리

## 📦 주요 의존성

### 모바일 앱

| 패키지                                    | 버전   | 용도                 |
| ----------------------------------------- | ------ | -------------------- |
| react-native                              | 0.80.0 | 모바일 앱 프레임워크 |
| @react-navigation/native                  | 7.1.14 | 네비게이션           |
| axios                                     | 1.10.0 | HTTP 클라이언트      |
| @react-native-google-signin/google-signin | 15.0.0 | Google 로그인        |
| react-native-vector-icons                 | 10.2.0 | 아이콘               |
| @react-native-firebase/app                | 23.0.0 | Firebase 통합        |

### AI 추천 시스템

| 구분              | 기술        | 버전   | 용도                  |
| ----------------- | ----------- | ------ | --------------------- |
| **AI 엔진**       | OpenAI GPT  | latest | 지능형 음악 취향 분석 |
| **메시지 큐**     | RabbitMQ    | 3.13   | 비동기 추천 요청 처리 |
| **캐시**          | Redis       | 6.0+   | 추천 결과 캐시 저장   |
| **스케줄러**      | APScheduler | latest | 정기적 배치 처리      |
| **웹 프레임워크** | FastAPI     | latest | AI 서비스 API 제공    |

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 각 저장소의 이슈 탭에서 등록해 주세요.

- **전체 프로젝트 문의**: [song_fe Issues](https://github.com/Zara8170/song_fe/issues)
- **백엔드 관련**: [songs_be Issues](https://github.com/Zara8170/songs_be/issues)
- **검색 엔진 관련**: [song_elasticsearch Issues](https://github.com/Zara8170/song_elasticsearch/issues)
- **AI 추천 관련**: [song_ai Issues](https://github.com/Zara8170/song_ai/issues)

---

<div align="center">
  Made with ❤️ by the UtaBox Team
  
  ⭐ **이 프로젝트가 도움이 되셨다면 각 저장소에 Star를 눌러주세요!** ⭐
</div>
