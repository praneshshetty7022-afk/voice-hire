# VoiceHire - Voice-based Employment Platform

A modern employment platform that leverages voice technology to make job searching and hiring more accessible, especially for users with limited literacy or visual impairments.

## 🏗️ Project Structure

```
voicehire/
├── frontend/          # React + Vite frontend application
├── backend/           # Spring Boot + MongoDB backend
├── docs/             # Documentation
├── docker-compose.yml # Docker services configuration
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB 7.0 (or use Docker)
- Maven 3.8+

### Using Docker (Recommended)

1. Start MongoDB and other services:
```bash
docker-compose up -d mongodb mongo-express
```

2. Access MongoDB Express at `http://localhost:8081`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

4. Access Swagger UI at `http://localhost:8080/api/swagger-ui.html`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

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
