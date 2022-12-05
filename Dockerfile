FROM node:14.15.4-alpine3.12 AS ReactBuild

WORKDIR /app

COPY interface/package.json .
COPY interface/package-lock.json .

RUN npm install

COPY interface .

RUN npm run build

FROM node:14.15.4-alpine3.12 AS Release

WORKDIR /app

COPY api/package.json .
COPY api/package-lock.json .

RUN npm install --production

COPY api .

COPY --from=ReactBuild /app/build ./public

EXPOSE 8080

CMD ["npm", "start"]