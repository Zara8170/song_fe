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

| 저장소                                                                      | 역할              | 기술 스택                  | 설명                      |
| --------------------------------------------------------------------------- | ----------------- | -------------------------- | ------------------------- |
| **[📱 song_fe](https://github.com/Zara8170/song_fe)**                       | 모바일 프론트엔드 | React Native, TypeScript   | 사용자 인터페이스 앱      |
| **[🚀 songs_be](https://github.com/Zara8170/songs_be)**                     | 백엔드 API 서버   | Spring Boot, Java          | 핵심 비즈니스 로직 및 API |
| **[🔍 song_elasticsearch](https://github.com/Zara8170/song_elasticsearch)** | 검색 엔진         | Elasticsearch, Python      | 노래 검색 및 추천 시스템  |
| **[🤖 song_ai](https://github.com/Zara8170/song_ai)**                       | AI 추천 서버      | Python, TensorFlow/PyTorch | 머신러닝 기반 음악 추천   |

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

- 머신러닝 기반 개인화 추천
- 사용자 행동 패턴 분석
- 협업 필터링 알고리즘
- GPU 기반 모델 추론

### ✨ 주요 기능

- 🔍 **노래 검색**: 제목, 아티스트, 가사로 원하는 노래를 쉽게 찾기
- 📁 **보관함**: 좋아하는 노래들을 플레이리스트로 관리
- ⭐ **노래 추천**: AI 기반 개인 맞춤형 노래 추천
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

### 모니터링 & 운영

- **Prometheus** - 메트릭 수집 및 저장
- **Grafana** - 데이터 시각화 및 대시보드
- **Node Exporter** - 시스템 메트릭 수집
- **Docker Compose** - 모니터링 스택 관리

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

# 모니터링 스택 관리
npm run monitoring:deploy     # 모든 VM에 Exporter 배포
npm run monitoring:up         # 중앙 모니터링 서버 시작
npm run monitoring:down       # 중앙 모니터링 서버 중지
npm run monitoring:status     # 전체 모니터링 상태 확인
npm run monitoring:check-vms  # 각 VM별 Exporter 상태 확인
npm run monitoring:logs       # 모니터링 서버 로그 확인
npm run monitoring:backup    # 모니터링 데이터 백업
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

## 📊 서버 모니터링

### Prometheus & Grafana 연동

앱의 백엔드 서버 모니터링을 위해 Prometheus와 Grafana를 활용한 모니터링 시스템을 구축했습니다.

#### 🔍 모니터링 메트릭

- **시스템 메트릭**

  - CPU 사용률
  - 메모리 사용량
  - 디스크 I/O
  - 네트워크 트래픽

- **애플리케이션 메트릭**

  - API 응답 시간
  - 요청 처리량 (RPS)
  - 에러율
  - 활성 사용자 수
  - 데이터베이스 연결 상태

- **비즈니스 메트릭**
  - 노래 검색 횟수
  - 플레이리스트 생성/수정 빈도
  - 사용자 로그인/로그아웃 패턴
  - 추천 시스템 활용도

#### 🛠 모니터링 아키텍처

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  DB Server VM   │  │ Elastic Server  │  │  API Server VM  │  │  AI Server VM   │
│                 │  │      VM         │  │                 │  │                 │
│ Node Exporter   │  │ Node Exporter   │  │ Node Exporter   │  │ Node Exporter   │
│ :9100           │  │ :9100           │  │ :9100           │  │ :9100           │
│                 │  │                 │  │                 │  │                 │
│ MySQL Exporter  │  │ ES Exporter     │  │ App Metrics     │  │ GPU Exporter    │
│ :9104           │  │ :9114           │  │ :3000           │  │ :9400           │
│                 │  │                 │  │                 │  │                 │
│ PostgreSQL Exp. │  │ Filebeat        │  │ Process Exp.    │  │ Model Metrics   │
│ :9187           │  │ :5066           │  │ :9256           │  │ :8080           │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │                    │
         └────────────────────┼────────────────────┼────────────────────┘
                              │                    │
                    ┌─────────────────────┐       │
                    │   모니터링 서버     │       │
                    │                     │       │
                    │ Prometheus :9090    │       │
                    │ Grafana    :3000    │       │
                    │ Alertmanager :9093  │       │
                    │ Nginx      :80/443  │       │
                    └─────────────────────┘       │
                              │                    │
                              └────────────────────┘
```

#### 📈 대시보드 구성

1. **시스템 오버뷰 대시보드**

   - 서버 상태 종합 현황
   - CPU, 메모리, 디스크 사용률
   - 네트워크 트래픽 모니터링

2. **애플리케이션 성능 대시보드**

   - API 엔드포인트별 응답 시간
   - 에러율 및 성공률 추이
   - 데이터베이스 쿼리 성능

3. **사용자 활동 대시보드**
   - 실시간 활성 사용자
   - 기능별 사용 패턴
   - 지역별 접속 현황

#### 🚨 알림 설정

- **Critical 알림**

  - 서버 다운 (HTTP 500 에러율 > 5%)
  - 메모리 사용률 > 90%
  - 디스크 사용률 > 85%

- **Warning 알림**
  - API 응답 시간 > 2초
  - CPU 사용률 > 80%
  - 에러율 > 1%

#### 🎯 모니터링 대상 서버

| 서버 구분    | 주요 역할              | 모니터링 포인트                         |
| ------------ | ---------------------- | --------------------------------------- |
| **DB 서버**  | 데이터베이스 관리      | MySQL, PostgreSQL 성능 및 가용성        |
| **Elastic**  | 검색 엔진 및 로그 관리 | Elasticsearch 클러스터 상태, 로그 수집  |
| **API 서버** | 백엔드 API 서비스      | Node.js 애플리케이션 성능, API 응답시간 |
| **AI 서버**  | 머신러닝 모델 처리     | GPU 사용률, 모델 추론 성능              |

#### 📊 모니터링 기능

- **실시간 시스템 모니터링**: CPU, 메모리, 디스크, 네트워크 사용률
- **애플리케이션 성능 추적**: API 응답시간, 처리량, 에러율
- **데이터베이스 성능 분석**: 쿼리 성능, 연결 상태, 저장공간
- **AI 워크로드 모니터링**: GPU 활용률, 모델 추론 시간, 메모리 사용량
- **로그 중앙화**: 모든 서버의 로그를 Elasticsearch로 수집 및 분석
- **알림 시스템**: 임계값 초과 시 실시간 알림

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

### 모니터링 스택

| 구분          | 도구                   | 버전   | 용도                | 포트 |
| ------------- | ---------------------- | ------ | ------------------- | ---- |
| **중앙 서버** | Prometheus             | latest | 메트릭 수집 및 저장 | 9090 |
|               | Grafana                | latest | 데이터 시각화       | 3000 |
|               | Alertmanager           | latest | 알림 관리           | 9093 |
| **공통**      | Node Exporter          | latest | 시스템 메트릭 수집  | 9100 |
| **DB 서버**   | MySQL Exporter         | latest | MySQL 메트릭        | 9104 |
|               | PostgreSQL Exporter    | latest | PostgreSQL 메트릭   | 9187 |
| **Elastic**   | Elasticsearch Exporter | latest | ES 메트릭           | 9114 |
|               | Filebeat               | latest | 로그 수집           | 5066 |
| **API 서버**  | Node.js prom-client    | latest | 애플리케이션 메트릭 | 3000 |
|               | Process Exporter       | latest | 프로세스 모니터링   | 9256 |
| **AI 서버**   | NVIDIA GPU Exporter    | latest | GPU 사용률 모니터링 | 9400 |
|               | Custom Model Metrics   | latest | ML 모델 성능 메트릭 | 8080 |

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
