# Étape 1 : Installer les dépendances
FROM node:22.14 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Étape 2 : Builder l'application Angular
FROM node:22.14 AS build

WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 👇 Variable d’environnement transmise au build
ARG API_URL
ENV API_URL=$API_URL

# ✅ Corrigé : écriture dans environment.ts et environment.prod.ts
RUN mkdir -p src/environments && \
  echo "export const environment = {" > src/environments/environment.ts && \
  echo "  production: true," >> src/environments/environment.ts && \
  echo "  apiUrl: '${API_URL}'" >> src/environments/environment.ts && \
  echo "};" >> src/environments/environment.ts && \
  cp src/environments/environment.ts src/environments/environment.prod.ts && \
  cat src/environments/environment.ts

# Build Angular en mode production
RUN pnpm run build --configuration=production

# Étape 3 : NGINX pour le déploiement
FROM nginx:alpine

COPY --from=build /app/dist/ng-app-portfolio/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
