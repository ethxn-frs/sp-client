# Utiliser une image Nginx officielle comme image de base
FROM nginx:stable-alpine

# Copier les fichiers de construction React vers le répertoire Nginx
COPY build /usr/share/nginx/html

# Exposer le port sur lequel Nginx fonctionne
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
