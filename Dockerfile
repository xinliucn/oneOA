# syntax=docker/dockerfile:1.4
# 多阶段构建 Dockerfile for Nuxt SSR (Monorepo with Yarn)

# ============================================
# 阶段 1: 构建阶段
# ============================================
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装项目锁定的 yarn，并使用国内镜像源提升 Docker 构建稳定性
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
ENV ONNXRUNTIME_NODE_INSTALL_CUDA=skip
RUN npm config set registry https://registry.npmmirror.com \
  && yarn config set registry https://registry.npmmirror.com \
  && yarn config set network-timeout 600000

# 先复制依赖描述文件，避免业务代码变更导致依赖安装层失效
COPY package*.json yarn.lock ./
COPY playground/package.json ./playground/package.json

# 安装所有依赖
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
  yarn install --frozen-lockfile --network-timeout 600000 --network-concurrency 4 --cache-folder /usr/local/share/.cache/yarn

# 复制源码
COPY src/ ./src/
COPY playground/ ./playground/

# 准备和构建 superApp 模块
WORKDIR /app
RUN yarn dev:prepare

# 进入 playground 目录构建
WORKDIR /app/playground
RUN yarn build

# ============================================
# 阶段 2: 运行阶段
# ============================================
FROM node:22-alpine AS runner

# 设置工作目录
WORKDIR /app

# 安装 curl（用于健康检查）
RUN apk add --no-cache curl

# 复制构建产物
COPY --from=builder /app/playground/.output /app/.output

# 暴露端口
EXPOSE 80

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# 启动应用
CMD ["node", ".output/server/index.mjs"]
