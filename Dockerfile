FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto
COPY . .

# Instalar dependencias del package.json principal
RUN npm install

# Instalar dependencias del proyecto tanto backend como frontend
RUN npm run install

# Construir el frontend usando el comando  del package.json principal
RUN npm run build

# Exponer el puerto del backend
EXPOSE 3001

# Establecer las variables de entorno en tiempo de ejecución
ENV NODE_ENV=production

# Comando para iniciar el proyecto completo
CMD ["npm", "start"]