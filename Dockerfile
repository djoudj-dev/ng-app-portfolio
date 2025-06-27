# Étape 1 : Builder Angular
FROM node:22-alpine AS build

WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Génération de l'env prod
ARG API_URL
ENV API_URL=${API_URL:-https://api.nedellec-julien.fr}
RUN mkdir -p src/environments && \
    echo "export const environment = {" > src/environments/environment.prod.ts && \
    echo "  production: true," >> src/environments/environment.prod.ts && \
    echo "  apiUrl: '${API_URL}'" >> src/environments/environment.prod.ts && \
    echo "};" >> src/environments/environment.prod.ts

RUN pnpm run build --configuration=production

# Étape 2 : Serveur statique avec Caddy
FROM caddy:2.8.4-alpine

COPY --from=build /app/dist/ng-app-portfolio /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Exposer seulement le port 80 si derrière un reverse proxy
EXPOSE 80
