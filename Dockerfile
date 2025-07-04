# Dockerfile for frontend (operation-friday-fe)

# --- Build Stage ---
# Node.js 20 LTS 버전을 사용하여 빌드 환경을 구성합니다.
FROM node:20-alpine AS build

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# package.json과 package-lock.json (또는 yarn.lock)을 복사하여 종속성을 설치합니다.
# 이렇게 하면 package.json이 변경되지 않는 한 캐시 레이어를 재사용할 수 있습니다.
COPY package*.json ./

# Node.js 종속성을 설치합니다.
# yarn을 사용한다면 RUN yarn install 로 변경하세요.
RUN npm install

# 모든 소스 코드를 복사합니다.
COPY . .

# 프론트엔드 애플리케이션을 빌드합니다.
# package.json의 "build" 스크립트와 일치해야 합니다.
RUN npm run build

# --- Serve Stage ---
# 가벼운 Nginx 이미지를 사용하여 빌드된 정적 파일들을 서빙합니다.
FROM nginx:stable-alpine

# Nginx 기본 설정 파일을 제거하고, 커스텀 설정을 복사합니다.
# (선택 사항: 필요한 경우 nginx.conf 파일을 직접 만들어 사용)
# 아래 설정은 기본 Nginx 설정을 사용하며, 보통 build/dist 폴더를 직접 서빙합니다.
# 만약 Nginx 설정이 필요하다면 아래 주석 해제 후 파일을 생성하세요.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 스테이지에서 생성된 정적 파일들을 Nginx의 기본 웹 루트로 복사합니다.
# Vite의 기본 빌드 출력 디렉토리는 'dist'입니다.
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx의 기본 HTTP 포트를 노출합니다.
EXPOSE 80

# Nginx 서버를 시작합니다.
CMD ["nginx", "-g", "daemon off;"]
