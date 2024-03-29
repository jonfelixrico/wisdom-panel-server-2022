# Base image
FROM node:16.18-alpine AS base
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/node_modules ./node_modules

# needed so that @nestjs/config can still get the default env file
COPY .env.defaults ./

EXPOSE 9085

CMD ["node", "dist/src/main.js"]