import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Load environment configuration
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins (Vercel deployments, localhost, and custom domain)
const configuredOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS configuration supporting Vercel and production deployments
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow configured origins or any Vercel deployment preview/production URL
      if (
        configuredOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, origin);
      }

      // Permissive fallback
      return callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Explicitly handle preflight requests across all routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development / Render logs
app.use((req, res, next) => {
  if (req.originalUrl !== '/api/health' && req.originalUrl !== '/health') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Primary API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health Check Endpoint (supports both /api/health and /health for Render & monitoring)
const healthHandler = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'healthy',
    database: isDbConnected ? 'connected-atlas' : 'fallback-in-memory',
    service: 'VoiceHire (Udyoga Mitra) Unified Engine',
    roles: ['employee', 'employer'],
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to VoiceHire (Udyoga Mitra) - Voice-First Employment Platform API',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications',
      health: '/api/health',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Bind to 0.0.0.0 for standalone environments like Render or local development.
// When running in Vercel Serverless Functions, Vercel manages the HTTP listener directly.
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VoiceHire Platform Server running on port ${PORT}`);
    console.log(`🌐 API Endpoints: http://localhost:${PORT}/api`);
    console.log(`👥 Roles Supported: [employee, employer]`);
    console.log(`======================================================\n`);
  });
}

export default app;

