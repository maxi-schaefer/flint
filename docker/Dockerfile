FROM node:20-bookworm

RUN apt update && apt install -y \
  openjdk-17-jre-headless \
  tini \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

VOLUME ["/data"]
EXPOSE 3000 8080

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sh", "docker/entrypoint.sh"]