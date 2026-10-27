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

---

## 7. Cloud Production Hosting (Vercel + Render + MongoDB Atlas)

This is the recommended modern deployment architecture:
- **Frontend**: [Vercel](https://vercel.com) (Global CDN, automated SSL, HTTPS for Web Speech API)
- **Backend API**: [Render](https://render.com) (Native Node.js Web Service with automatic deploys & `/api/health` monitoring)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 cloud cluster with auto backups)

```
┌─────────────────────────┐          ┌──────────────────────────┐          ┌───────────────────────┐
│     Vercel Frontend     │  HTTPS   │      Render Backend      │  TLS/SRV │     MongoDB Atlas     │
│ https://xxx.vercel.app  ├─────────►│ https://xxx.onrender.com ├─────────►│   Cluster0 (M0 Free)  │
│  (React 18 + Vite SPA)  │          │   (Node.js / Express)    │          │  (Cloud Database)     │
└─────────────────────────┘          └──────────────────────────┘          └───────────────────────┘
```

---

### 7.1 Database: MongoDB Atlas Setup (Free M0 Tier)

1. **Sign Up / Log In**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. **Create Database Cluster**:
   - Select **M0 Free** cluster (choose AWS or GCP in your preferred region, e.g. Mumbai `ap-south-1` or Oregon `us-west-2`).
3. **Database Access (User Credentials)**:
   - In the left sidebar, navigate to **Security** -> **Database Access**.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g. `voicehire_admin`) and a secure password.
   - Set privileges to **Read and write to any database**.
   - Click **Add User**.
4. **Network Access (IP Whitelist)**:
   - Navigate to **Security** -> **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) so that Render can connect dynamically.
   - Click **Confirm**.
5. **Get Connection String**:
   - Navigate to **Database** -> **Clusters** -> click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy your connection string:
     ```
     mongodb+srv://voicehire_admin:<password>@cluster0.xxxxx.mongodb.net/voicehire?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password and ensure the database name is `voicehire`.

---

### 7.2 Backend: Deploy to Render Web Service

VoiceHire includes an automated Render Blueprint configuration (`render.yaml`).

#### Option A: One-Click Deploy with `render.yaml`
1. Push your repository to GitHub.
2. Log into [Render](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository `voice-hire`. Render will read `render.yaml` automatically.
5. Provide your `MONGO_URI` when prompted and click **Apply**.

#### Option B: Manual Web Service Setup
1. On [Render](https://render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository `voice-hire`.
3. Configure the service:
   - **Name**: `voicehire-backend`
   - **Region**: Oregon or Singapore
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/voicehire?retryWrites=true&w=majority`
   - `JWT_SECRET`: `voicehire_production_secure_jwt_secret_token_2026_super_key`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `*` (or your Vercel URL once deployed)
5. Under **Health Check Path**, enter: `/api/health`.
6. Click **Deploy Web Service**.
7. Once deployed, test the health check in your browser:
   `https://<your-service-name>.onrender.com/api/health`
   You should see:
   ```json
   {
     "status": "healthy",
     "database": "connected-atlas",
     "service": "VoiceHire (Udyoga Mitra) Unified Engine"
   }
   ```

---

### 7.3 Frontend: Deploy to Vercel (Vite SPA)

VoiceHire includes pre-configured `vercel.json` and `frontend/vercel.json` for instant single-page routing and SSL security.

1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select and import your `voice-hire` repository.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend` (or keep root — both are pre-configured!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://<your-service-name>.onrender.com/api`
   - `VITE_DEFAULT_LANGUAGE`: `en`
   - `VITE_ENABLE_VOICE_SYNTHESIS`: `true`
6. Click **Deploy**.
7. In ~30 seconds, your site is live with HTTPS (e.g., `https://voice-hire-xxxx.vercel.app`).
   Because Vercel provides automatic valid SSL certificates, the **Web Speech API** (Microphone speech-to-text and audio speech synthesis) will work seamlessly across Chrome, Edge, Safari, and mobile browsers!

---

## 8. Verification & Operational Testing

| Test Check | Method | Expected Result |
|---|---|---|
| **Backend Health** | `GET https://<render-url>/api/health` | `status: "healthy"`, `database: "connected-atlas"` |
| **Frontend Health** | Open `https://<vercel-url>` | Intro / Onboarding screen renders smoothly |
| **CORS Handshake** | Inspect Network tab during register/login | 200/201 responses with valid JWT token |
| **Microphone Permission** | Click Mic icon on registration/application | Browser prompts for mic access and recognizes voice |
| **Database Persistence** | Register a worker profile and refresh page | User stays authenticated and data persists in Atlas |

