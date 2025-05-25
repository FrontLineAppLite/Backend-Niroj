### ───────────────────────── 1. deps stage ──────────────────────
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++

# ① root manifests
COPY package.json package-lock.json ./

# ② ALL workspaces (utility + services)
COPY packages  ./packages
COPY services  ./services         

# ③ install
RUN npm ci --omit=dev --workspaces --include-workspace-root

### ───────────────────────── 2. runtime stage – ──────────────────────
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/packages     ./packages
COPY --from=deps /usr/src/app/services/auth ./services/auth

WORKDIR /usr/src/app/services/auth
ENV PORT=4000
EXPOSE 4000
USER node
CMD ["node", "src/index.js"]