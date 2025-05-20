# Portfolio de Julien NÉDELLEC
![Portfolio](public/images/projects/portfolio.webp)

## Pourquoi ce portfolio ?

J'ai créé ce portfolio pour présenter mon parcours, mes compétences et mes projets en tant que développeur web et web mobile. Passionné par le code propre et durable, je considère chaque ligne comme une brique d'un ensemble cohérent, lisible et maintenable.

Mon approche repose sur une architecture modulaire, pensée pour évoluer avec les équipes et les besoins techniques. Je conçois des interfaces claires, accessibles et centrées sur l'utilisateur, pour répondre à de vrais besoins avec sens et efficacité.

Ce qui me motive, c'est d'écrire un code clair, structuré et testé, capable d'évoluer sereinement face aux besoins concrets. Je conçois des solutions simples, robustes et durables, en restant à l'écoute des usages pour offrir une expérience fluide et pertinente.

## Technologies utilisées

Ce portfolio a été développé avec les technologies suivantes :
- Angular 19
- TypeScript
- TailwindCSS
- RxJS
- EmailJS pour le formulaire de contact

## Fonctionnalités

- Design responsive adapté à tous les appareils
- Mode sombre/clair
- Formulaire de contact fonctionnel
- Optimisation des images pour de meilleures performances
- Architecture modulaire et maintenable

## Serveur de développement

Pour démarrer un serveur de développement local, exécutez :

```bash
ng serve
```

Une fois le serveur démarré, ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez l'un des fichiers source.

## Construction

Pour construire le projet, exécutez :

```bash
ng build
```

Cela compilera votre projet et stockera les artefacts de construction dans le répertoire `dist/`. Par défaut, la construction de production optimise votre application pour les performances et la vitesse.

## Tests unitaires

Pour exécuter les tests unitaires avec Vitest, utilisez la commande suivante :

```bash
pnpm run test
```

## Configuration du formulaire de contact

Cette application utilise [EmailJS](https://www.emailjs.com/) pour envoyer des emails depuis le formulaire de contact. Pour configurer EmailJS pour votre propre usage :

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un nouveau service Email dans votre tableau de bord EmailJS
3. Créez un nouveau modèle d'email dans votre tableau de bord EmailJS
4. Mettez à jour les valeurs de configuration suivantes dans l'application :

### Dans `src/app/app.component.ts` :
```typescript
// Initialiser EmailJS avec votre clé publique
emailjs.init('VOTRE_CLE_PUBLIQUE_DU_TABLEAU_DE_BORD_EMAILJS');
```

### Dans `src/app/features/public/contact/service/contact.service.ts` :
```typescript
// Configuration EmailJS
const emailjsServiceId = 'VOTRE_ID_DE_SERVICE_DU_TABLEAU_DE_BORD_EMAILJS';
const emailjsTemplateId = 'VOTRE_ID_DE_MODELE_DU_TABLEAU_DE_BORD_EMAILJS';
```

## Chargement des données

Cette application charge les données directement à partir d'un fichier JSON situé dans le répertoire `public/` à la racine du projet. Les données sont chargées à l'aide du HttpClient d'Angular et sont disponibles dans toute l'application.

La structure des données est définie dans le fichier `public/db.json`, qui contient des sections pour différentes parties de l'application (hero, about, projects, stacks, etc.).

Aucun serveur supplémentaire n'est nécessaire pour exécuter l'application, car les données sont chargées directement à partir du fichier.

## Optimisation des images

Cette application utilise la directive NgOptimizedImage d'Angular pour optimiser le chargement et le rendu des images. Pour assurer des performances optimales :

1. Utilisez des dimensions d'image appropriées qui correspondent à la taille d'affichage
2. Configurez l'attribut `sizes` pour informer le navigateur de la taille d'affichage de l'image à différentes largeurs de viewport
3. Envisagez d'utiliser l'attribut `ngSrcset` pour fournir plusieurs tailles d'image pour les conceptions responsives
