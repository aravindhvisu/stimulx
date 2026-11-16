# Stimulx on Google Cloud Run
#   gcloud run deploy stimulx --source . --region asia-south1 \
#     --allow-unauthenticated --set-secrets GEMINI_API_KEY=gemini-api-key:latest

# Study data is a SQLite file under DATA_DIR (default /app/data). Cloud Run's disk is wiped on
# every restart, so mount a persistent volume there before collecting real data.

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/out ./out
COPY --from=build /app/src/server ./src/server
COPY --from=build /app/server.mjs ./server.mjs
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
