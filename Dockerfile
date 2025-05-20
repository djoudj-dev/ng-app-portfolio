# Étape 1 : Utiliser une image Node.js comme base
FROM node:22.14 as node

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers de l'application
COPY . .

# Étape 2 : Builder l'application Angular
FROM node:22.14 as build

WORKDIR /app

# Installer pnpm dans l'étape de build
RUN npm install -g pnpm

# Créer le fichier d'environnement à partir de la variable d'environnement Coolify
RUN mkdir -p src/environments && echo "$PORTFOLIO_CONFIG_B64" | base64 -d > src/environments/environment.ts

# Copier les fichiers nécessaires pour le build
COPY --from=node /app/node_modules ./node_modules
COPY . .

# Builder l'application
RUN pnpm run build

# Étape 3 : Utiliser une image Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire de Nginx
COPY --from=build /app/dist/ng-app-portfolio /usr/share/nginx/html

# Copier le fichier de configuration Nginx personnalisé si nécessaire
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
