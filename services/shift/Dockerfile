### deps stage
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY packages  ./packages
COPY services  ./services
RUN npm ci --omit=dev --workspaces --include-workspace-root

### runtime stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/packages     ./packages
COPY --from=deps /usr/src/app/services/shift ./services/shift
WORKDIR /usr/src/app/services/shift
ENV PORT=5300
EXPOSE 5300
USER node
CMD ["node", "src/index.js"]