FROM node:20-alpine AS build-env
COPY . /app/
WORKDIR /app
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build-env /app/build/client /usr/share/nginx/html/ux-quest
RUN printf 'server {\n\
    listen 3000;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location /ux-quest/ {\n\
        try_files $uri $uri/ /ux-quest/index.html;\n\
    }\n\
    location = / {\n\
        return 301 /ux-quest/;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
