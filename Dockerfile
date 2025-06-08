# Rust编译
FROM registry.xiaoyou.host/library/node:20.10.0 AS node-build
WORKDIR /web
COPY . .
RUN corepack enable pnpm && cd common && pnpm install --registry=https://nexus.xiaoyou.host/repository/npm && pnpm run build && cd ..
RUN pnpm install --registry=https://nexus.xiaoyou.host/repository/npm && pnpm run build && mv common/dist/common dist/common
# 使用空镜像来构建
FROM registry.xiaoyou.host/library/alpine:3.19
WORKDIR /html
# 拷贝编译结果
COPY --from=node-build /web/dist /html
# 卡住不执行操作
CMD /bin/sh
