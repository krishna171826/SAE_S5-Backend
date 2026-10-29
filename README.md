# ⚙️ SAE S5 - Backend

Bienvenue sur le backend de notre application de recommandation d’activités géolocalisées.

Ce serveur est développé avec **Node.js** et **Express**. Il communique avec une base de données **PostgreSQL + PostGIS** qui tourne dans un conteneur Docker.

## 🚀 Installation

### 1. Installer les dépendances

Ouvrez un terminal, placez-vous dans le dossier du backend (`SAE_S5-Backend`) puis exécutez :

```
npm install

```

Cette commande installe tous les outils nécessaires au projet (Express, `node-pg-migrate`, `dotenv-cli`, etc.).

## 🔧 Configuration de l'environnement (`.env`)

Pour que les migrations et le serveur puissent se connecter à votre base de données Docker locale, vous devez créer votre fichier de configuration personnel.

1. Dupliquez le fichier modèle **`.env.exemple`** situé dans ce dossier. ( `SAE_S5-Backend )`

2. Renommez la copie en **`.env`**.

3. Ouvrez ce fichier `.env` et remplacez `VOTRE_MOT_DE_PASSE_ICI` par le mot de passe que vous avez choisi dans le fichier `.env` principal (à la racine du projet pour Docker) :

```
DATABASE_URL=postgres://sae:VOTRE_MOT_DE_PASSE_ICI@localhost:5433/sae_s5

```

> 💡 **Pourquoi le port 5433 ?** Dans notre `compose.yaml`, PostgreSQL tourne sur le port 5432 à l'intérieur de Docker, mais il est exposé sur le port **5433** de notre machine locale (`localhost`) pour éviter les conflits.
>
> ⚠️ **Sécurité :** Le fichier `.env` contient votre mot de passe personnel. Il est listé dans le `.gitignore` et ne doit **jamais** être envoyé sur GitHub.

## 🔄 Migrations de la Base de Données

Nous utilisons **node-pg-migrate** pour gérer la structure de notre base de données PostgreSQL.

Les migrations permettent à toute l'équipe d'avoir exactement les mêmes tables et colonnes sans jamais avoir à écrire du SQL manuellement dans la base. Tous les fichiers de suivi sont stockés dans le dossier `/migrations`.

### ▶️ 1. Mettre à jour sa base de données (Appliquer les migrations)

À chaque fois que vous récupérez le travail de l'équipe avec `git pull`, mettez à jour votre base de données locale en lançant :

```
npm run migrate up

```

Cette commande lit automatiquement votre fichier `.env` et applique toutes les nouvelles modifications dans l'ordre chronologique.

### ➕ 2. Créer une nouvelle migration

Si vous avez besoin de créer une nouvelle table ou de modifier une colonne, générez un nouveau fichier avec :

```
npm run migrate create nom_de_la_modification

```

*Exemple :*

```
npm run migrate create ajout_table_activites

```

Un nouveau fichier horodaté (ex: `1793104098392_ajout_table_activites.js`) apparaîtra dans le dossier `/migrations`. Il contient deux parties à compléter en JavaScript :

* **`up`** : Le code pour appliquer la modification (ex: `pgm.createTable(...)`).

* **`down`** : Le code pour annuler la modification en cas d'erreur (ex: `pgm.dropTable(...)`).

Une fois votre fichier complété et sauvegardé, appliquez-le avec `npm run migrate up`.

### ↩️ 3. Annuler la dernière migration

Si vous avez fait une erreur dans votre migration et souhaitez revenir en arrière:

```
npm run migrate down

```
SAE_S5-Backend/
│
├── migrations/        x    # Historique des modifications de la base de données
│   └── 1793104098392_init.js
```
