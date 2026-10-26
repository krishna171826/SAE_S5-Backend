FROM node:20-alpine

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Exposition du port Express
EXPOSE 3000

# Lancement du serveur Node.js
CMD ["npm", "start"]