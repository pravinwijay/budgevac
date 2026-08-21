# MYSG 2K26

Application de gestion de voyage construite avec React (Vite) pour le frontend et Node.js (Express/Sequelize) pour le backend.

## Structure du Projet

- `backend/` : Serveur API Express avec Sequelize (modèles et routes).
- `frontend/` : Application React (Vite) avec design minimaliste.
- `docker-compose.yml` : Configuration locale pour Microsoft SQL Server.

## Démarrage Local

### Étape 1 : Lancer SQL Server avec Docker
Assurez-vous que l'application Docker Desktop est lancée, puis exécutez la commande suivante à la racine :
```bash
docker compose up -d
```

### Étape 2 : Lancer le Backend
1. Naviguez dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur en mode développement :
   ```bash
   npm run dev
   ```
Le backend sera disponible sur le port `5001`.

### Étape 3 : Lancer le Frontend
1. Ouvrez un nouveau terminal et naviguez dans le dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement Vite :
   ```bash
   npm run dev
   ```
Le frontend sera accessible à l'adresse `http://localhost:3000`.

## Déploiement Cloud (Alternative PostgreSQL)

Pour un déploiement cloud simple et gratuit/économique, utilisez **PostgreSQL** :
1. Créez une instance de base de données PostgreSQL sur un service géré (comme Supabase ou Render).
2. Hébergez le backend sur **Render** ou **Railway** et ajoutez la variable d'environnement `DATABASE_URL` contenant l'URI de connexion de la base de données. Le code backend basculera automatiquement sur PostgreSQL.
3. Hébergez le frontend sur **Vercel** ou **Netlify**.
