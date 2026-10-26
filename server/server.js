import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Load environment configuration
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);

// Worker Profile Endpoint
app.get('/api/workers/profile', (req, res) => {
  const { id } = req.query;
  res.status(200).json({
    id: id || 'worker_default',
    accountStatus: 'APPROVED',
    verificationStatus: 'verified',
    trustScore: 98,
    role: 'WORKER',
  });
});

// Applications Endpoints
app.get('/api/applications/accepted', (req, res) => {
  res.status(200).json([]);
});

app.get('/api/applications/worker/:workerId', (req, res) => {
  res.status(200).json([]);
});

app.post('/api/applications', (req, res) => {
  const { jobId, workerId, workerName, applicationSource } = req.body;
  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: {
      id: 'app_' + Date.now(),
      jobId,
      workerId,
      workerName,
      status: 'SUBMITTED',
      applicationSource: applicationSource || 'WEB',
      createdAt: new Date().toISOString(),
    },
  });
});

// Jobs Endpoint
app.get('/api/jobs', (req, res) => {
  const seedJobs = [
    { id: '1', title: 'Professional Driver (Private Car & Cab)', category: 'DRIVER', location: 'Bengaluru', dailyWage: 1200, workTime: '8 AM – 6 PM', experience: '2+ Years', employerName: 'Nandi Motors' },
    { id: '2', title: 'Commercial Truck & Van Driver', category: 'DRIVER', location: 'Mysuru', dailyWage: 1400, workTime: '9 AM – 7 PM', experience: '3+ Years', employerName: 'Express Logistics' },
    { id: '3', title: 'Furniture Carpenter (Modular Work)', category: 'CARPENTER', location: 'Bengaluru', dailyWage: 1100, workTime: '9 AM – 6 PM', experience: '1+ Years', employerName: 'WoodCraft Interior' },
    { id: '3b', title: 'Royal Heritage Wood Carpenter', category: 'CARPENTER', location: 'Mysuru', dailyWage: 1250, workTime: '9 AM – 6 PM', experience: '2+ Years', employerName: 'Mysore Woodworks' },
    { id: '4', title: 'Construction & Warehouse Helper', category: 'HELPER', location: 'Bengaluru', dailyWage: 850, workTime: '8 AM – 5 PM', experience: 'Fresher / Any', employerName: 'Skyline Builders' },
    { id: '5', title: 'Residential Daily Cook & House Help', category: 'HOUSEHELP', location: 'Bengaluru', dailyWage: 900, workTime: '7 AM – 3 PM', experience: '1+ Years', employerName: 'Urban Home Services' },
    { id: '6', title: 'Interior Wall Painter & Polisher', category: 'PAINTER', location: 'Bengaluru', dailyWage: 1150, workTime: '9 AM – 6 PM', experience: '2+ Years', employerName: 'Rainbow Paints' },
    { id: '7', title: 'Building Electrician & Wireman', category: 'ELECTRICIAN', location: 'Bengaluru', dailyWage: 1300, workTime: '9 AM – 6 PM', experience: '3+ Years', employerName: 'PowerTech Electricals' },
    { id: '8', title: 'Sanitary & Pipe Plumber', category: 'PLUMBER', location: 'Bengaluru', dailyWage: 1250, workTime: '9 AM – 5 PM', experience: '2+ Years', employerName: 'AquaFlow Services' },
  ];

  const { category, location } = req.query;
  let results = seedJobs;

  if (category && category !== 'ALL') {
    results = results.filter(j => j.category.toUpperCase() === category.toUpperCase());
  }

  if (location && location !== 'ALL') {
    results = results.filter(j => j.location.toLowerCase() === location.toLowerCase());
  }

  res.status(200).json(results);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'VeriProof Corporate Authentication API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Root Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to VeriProof Executive Identity & Authentication Engine',
    documentation: '/api/health',
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
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ VeriProof Corporate Auth Server is running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`======================================================\n`);
});

export default app;
