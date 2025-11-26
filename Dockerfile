FROM node:18-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para sqlite3
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  sqlite3 \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
