### ───────────────────────── 1. deps stage ──────────────────────
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY packages  ./packages
COPY services  ./services          
RUN npm ci --omit=dev --workspaces --include-workspace-root

### ───────────────────────── 2. runtime stage ──────────────────────
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/packages     ./packages
COPY --from=deps /usr/src/app/services/task ./services/task
WORKDIR /usr/src/app/services/task
ENV PORT=5001
EXPOSE 5001
USER node
CMD ["node", "src/index.js"]