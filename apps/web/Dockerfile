FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# The code will be mounted as a volume for hot reload
CMD ["pnpm", "dev"]
