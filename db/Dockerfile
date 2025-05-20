FROM node:18-alpine as base

WORKDIR /app

FROM base AS deps

COPY package.json ./
COPY *-lock.* ./

RUN npm i -g corepack@latest

RUN corepack enable
RUN pnpm config set store-dir $PNPM_MODULES_FOLDER
RUN pnpm config set package-import-method copy

ARG PNPM_MODULES_FOLDER="/pnpm"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN --mount=type=cache,id=pnpm,target=$PNPM_MODULES_FOLDER PNPM_HOME=$PNPM_MODULES_FOLDER pnpm install --prefer-offline --prod --frozen-lockfile

FROM base AS run

COPY package.json /app/package.json
COPY --from=deps /app/node_modules /app/node_modules
COPY migrations /app/migrations
COPY migrate.js  /app/migrate.js
COPY run-migrations.js /app/run-migrations.js

CMD ["npx", "node-pg-migrate", "up"]
