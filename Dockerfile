FROM node:22.2.0 AS builder
RUN apt-get update -qq && apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libcairo-gobject2 libxinerama1 libgtk2.0-0 libpangoft2-1.0-0 libthai0 libpixman-1-0 libxcb-render0 libharfbuzz0b libdatrie1 libgraphite2-3 libgbm1
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# add line "try_files $uri $uri/ /index.html;" after line "/usr/share/nginx/html;"
RUN sed -i 's/\/usr\/share\/nginx\/html;/\/usr\/share\/nginx\/html;\n        try_files $uri $uri\/ \/index.html;/g' /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/mapa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
