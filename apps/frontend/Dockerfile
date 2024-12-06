FROM node:18-alpine

WORKDIR /app

# 必要なファイルをコピー
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# アプリケーションのソースコードをコピー
COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
