# Étape 1 : Installer les dépendances
FROM node:22.14 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Étape 2 : Builder l'application Angular
FROM node:22.14 AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 👇 Variable d’environnement transmise au build
ARG API_URL
ENV API_URL=$API_URL

# Génération du fichier environment.ts à partir de la variable
RUN mkdir -p src/environments && \
    echo "export const environment = {" > src/environments/environment.ts && \
    echo "  production: false," >> src/environments/environment.ts && \
    echo "  apiUrl: '${API_URL}'" >> src/environments/environment.ts && \
    echo "};" >> src/environments/environment.ts && \
    cat src/environments/environment.ts

RUN npm install -g pnpm
RUN pnpm run build

# Étape 3 : NGINX pour le déploiement
FROM nginx:alpine

COPY --from=build /app/dist/ng-app-portfolio/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
