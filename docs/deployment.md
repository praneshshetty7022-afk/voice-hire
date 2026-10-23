# VoiceHire Deployment & Operational Guide

## 1. Overview

VoiceHire can be deployed in two modes:
1. **Containerized Mode (Docker Compose)**: Full stack deployment with MongoDB, Mongo Express, Spring Boot backend, and React frontend.
2. **Local Development Mode**: Running Spring Boot backend via Maven and React frontend via Vite dev server.

---

## 2. Environment Prerequisites

- **Java Development Kit**: OpenJDK 17 LTS or higher
- **Node.js**: Node 18.x or 20.x LTS
- **Build Tools**: Apache Maven 3.8+ & npm 9+
- **Containerization**: Docker Engine 24.0+ & Docker Compose v2+

---

## 3. Environment Variables Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```ini
# Database Settings
MONGO_URI=mongodb://root:example@mongodb:27017/voicehire?authSource=admin
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=pass

# Backend Application Settings
SERVER_PORT=8082
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=voicehire_super_secret_jwt_key_2026_udyoga_mitra_platform
JWT_EXPIRATION_MS=86400000

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8082
VITE_ENABLE_VOICE_SYNTHESIS=true
VITE_DEFAULT_LANGUAGE=kn-IN
```

---

## 4. Method A: Docker Deployment (Recommended)

### 4.1 Launch Services

From the project root directory:

```bash
# Build containers and start in detached mode
docker-compose up -d --build
```

### 4.2 Validate Container Health

```bash
docker-compose ps
```

Expected output:
- `voicehire-mongodb`: Running on port `27017`
- `voicehire-mongo-express`: Running on port `8081`
- `voicehire-backend`: Running on port `8082`
- `voicehire-frontend`: Running on port `3000`

### 4.3 Management Endpoints

- **Frontend Portal**: `http://localhost:3000`
- **Backend Health Check**: `http://localhost:8082/health`
- **Mongo Express UI**: `http://localhost:8081`

---

## 5. Method B: Local Development Execution

### 5.1 Start Backend Application

1. Navigate to backend directory:
```bash
cd backend
```

2. Compile and run Spring Boot:
```bash
mvn clean spring-boot:run
```

3. Verify service:
```bash
curl http://localhost:8082/health
# Response: {"service":"Udyoga Mitra Backend for Worker Employment","status":"UP"}
```

### 5.2 Start Frontend Application

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start Vite dev server:
```bash
npm run dev
```

4. Open browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## 6. Production Build & Packaging

### 6.1 Backend JAR Packaging

```bash
cd backend
mvn clean package -DskipTests
# Output artifact generated at backend/target/voicehire-backend-1.0.0.jar
```

To run standalone:
```bash
java -jar target/voicehire-backend-1.0.0.jar --server.port=8082
```

### 6.2 Frontend Production Bundle

```bash
cd frontend
npm run build
# Output static assets generated at frontend/dist/
```

Deploy the `dist/` directory to Nginx, AWS S3 + CloudFront, Vercel, or Netlify.

---

## 7. Method C: Cloud Production Hosting (Vercel + Render + MongoDB Atlas)

### 7.1 Database: MongoDB Atlas (Free M0)
1. Register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster (`M0`).
3. Under **Security -> Database Access**, create a user (e.g. `voicehire_user`).
4. Under **Security -> Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect -> Drivers -> Java** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/voicehire?retryWrites=true&w=majority
   ```

### 7.2 Backend: Render Web Service (Docker)
1. Sign in to [Render](https://render.com) using your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your repository `voice-hire`.
4. Configure settings:
   - **Environment / Runtime**: `Docker`
   - **Root Directory**: `backend` (or leave blank with `./backend/Dockerfile`)
   - **Instance Type**: `Free`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add:
   - `SPRING_DATA_MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `CORS_ALLOWED_ORIGINS`: `*`
   - `JWT_SECRET`: `voicehire_super_secret_jwt_key_2026_udyoga_mitra_platform_secure_token`
6. Click **Deploy Web Service**.
7. Once deployed, test the health check: `https://<service-name>.onrender.com/api/health`.

### 7.3 Frontend: Vercel (Vite SPA)
1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import the `voice-hire` repository.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, set:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-name>.onrender.com/api`
6. Click **Deploy**.
7. Vercel provides an automated SSL HTTPS URL (e.g., `https://voice-hire-xxxx.vercel.app`). Voice recording and speech synthesis work automatically out-of-the-box over HTTPS!

---

## 8. Troubleshooting & Common Fixes

| Symptom | Cause | Solution |
|---|---|---|
| Microphones / Voice command not responding | Chrome / Edge HTTP restriction | Web Speech API requires HTTPS or `http://localhost` origin |
| 8082 Port Conflict | Another process using port 8082 | Update `server.port` in `application.properties` or kill process on 8082 |
| MongoDB Connection Failed | Mongo service down | Run `docker-compose up -d mongodb` or check connection URI |
