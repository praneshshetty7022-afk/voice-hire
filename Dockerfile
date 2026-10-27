FROM node:20-alpine

WORKDIR /app

# Copy server package dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy all server code
COPY server/ .

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
