FROM node:20-alpine AS base

RUN npm i -g pnpm
COPY . /app

# Installing dev deps
FROM base AS  dev

COPY ./package.json pnpm-lock.yaml /app/

WORKDIR /app

RUN pnpm i --frozen-lockfile

# Installing prod deps
FROM base AS prod

COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app

RUN pnpm i --prod --frozen-lockfile

# Building
FROM base AS build

COPY ./package.json pnpm-lock.yaml /app/

COPY --from=dev /app/node_modules /app/node_modules
WORKDIR /app

RUN pnpm build

FROM base

COPY ./package.json pnpm-lock.yaml /app/

COPY --from=prod /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

WORKDIR /app

CMD ["pnpm", "start"]
