# VoiceHire (Udyoga Mitra) - Voice-First Employment Platform

A modern employment platform that leverages voice technology and AI to make job searching and hiring accessible, dignified, and frictionless for skilled workers and employers.

## 🏗️ Project Architecture & Cloud Deployment

```
┌────────────────────────────────┐       ┌────────────────────────────────┐       ┌────────────────────────────────┐
│        Vercel (Frontend)       │ HTTPS │        Render (Backend)        │  TLS  │     MongoDB Atlas (Database)   │
│ https://voicehire.vercel.app   ├──────►│ https://api.voicehire.render   ├──────►│   Cluster0 (M0 Free Cloud DB)  │
│     React 18 + Vite SPA        │       │   Node.js / Express Engine     │       │     Persistence & Schemas      │
└────────────────────────────────┘       └────────────────────────────────┘       └────────────────────────────────┘
```

```
voicehire/
├── frontend/          # React 18 + Vite frontend application (Vercel ready)
├── server/            # Node.js + Express backend engine (Render ready)
├── render.yaml        # Render Blueprint deployment configuration
├── vercel.json        # Vercel SPA routing and build configuration
├── package.json       # Monorepo orchestration scripts
└── docs/              # Comprehensive guides and documentation
```

## 🚀 Quick Deployment Guide

### 1. Database: MongoDB Atlas (Free M0)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Cluster (`M0`).
3. Under **Security -> Network Access**, allow `0.0.0.0/0` (access from anywhere).
4. Under **Security -> Database Access**, create your user and password.
5. Copy your connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/voicehire?retryWrites=true&w=majority`.

### 2. Backend: Render Web Service
1. Connect your repository to [Render](https://render.com).
2. Click **New +** -> **Blueprint** (uses `render.yaml`) OR **Web Service**:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variable:
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/voicehire?retryWrites=true&w=majority`
4. Deploy and copy your backend URL: `https://<service-name>.onrender.com`.

### 3. Frontend: Vercel SPA
1. Connect your repository to [Vercel](https://vercel.com).
2. Import project with preset **Vite**.
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-render-backend>.onrender.com/api`
4. Click **Deploy**. Your app is live with HTTPS and full Web Speech API support!

---

## 💻 Local Development


4. Access application at `http://localhost:3000`

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Database**: MongoDB 7.0
- **Security**: Spring Security + JWT
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Java Version**: 17

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Yup
- **Voice**: Web Speech API

## 📁 Key Features

### Voice Integration
- Voice commands for navigation
- Text-to-speech for accessibility
- Speech-to-text for form inputs
- Multi-language support

### User Roles
- **Workers**: Search jobs, apply with voice, track applications
- **Employers**: Post jobs, voice-based candidate screening
- **Admin**: Manage users, monitor fraud, analytics

### Core Functionality
- Job posting and search
- Voice-based applications
- AI-powered job matching
- Real-time notifications
- Interview scheduling
- Fraud detection

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- MongoDB connection settings
- JWT secret and expiration
- Email service settings
- Voice processing parameters

### Frontend Configuration
Edit `frontend/vite.config.js`:
- API proxy settings
- Path aliases
- Build configuration

## 📝 API Documentation

Once the backend is running, access the interactive API documentation at:
```
http://localhost:8080/api/swagger-ui.html
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run lint
```

## 🐳 Docker Services

The docker-compose.yml includes:
- **mongodb**: MongoDB database
- **mongo-express**: Web-based MongoDB admin interface
- **backend**: Spring Boot application (optional)
- **frontend**: React application (optional)

To start all services:
```bash
docker-compose up -d
```

To stop all services:
```bash
docker-compose down
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please open an issue in the repository.

## 🌟 Acknowledgments

- Spring Boot team for the amazing framework
- React community for the frontend libraries
- MongoDB for the flexible database solution
