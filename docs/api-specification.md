# VoiceHire / Udyoga Mitra API Specification

## Overview

The VoiceHire (Udyoga Mitra) API powers a voice-enabled recruitment and application platform tailored for skilled, low-literacy workers and employers. The API provides endpoints for authentication, job discovery, voice application submission, employer application management, worker profile administration, and platform auditing.

Base URL: `http://localhost:8082` (or `/api` in production)  
Content-Type: `application/json`

---

## 1. Authentication Endpoints

### 1.1 Register User / Worker
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new worker or user. Worker accounts default to `PENDING` account status requiring admin approval before full activation.
- **Request Body**:
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phoneNumber": "9812345678",
  "role": "WORKER",
  "preferredLanguage": "kn-IN",
  "skill": "DRIVER",
  "skills": "Driver (गाड़ी ड्राइवर)",
  "location": "Bengaluru",
  "experience": "3 Years",
  "preferredJob": "Personal Car Driver",
  "preferredLocation": "Bengaluru"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Registration submitted! Your account is pending admin approval.",
  "token": "jwt_user_a1b2c3d4",
  "user": {
    "id": "user_a1b2c3d4",
    "name": "Ramesh Kumar",
    "phoneNumber": "9812345678",
    "role": "WORKER",
    "accountStatus": "PENDING",
    "registeredAt": 1727700000000
  }
}
```

### 1.2 User Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates user via phone number or email address.
- **Request Body**:
```json
{
  "phoneNumber": "9876543210"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "jwt_worker_1",
  "user": {
    "id": "worker_1",
    "name": "Pranesh",
    "phoneNumber": "9876543210",
    "role": "WORKER",
    "accountStatus": "APPROVED"
  }
}
```

---

## 2. Job Categories Endpoints

### 2.1 Get Categories
- **Endpoint**: `GET /categories`
- **Description**: Returns all allowed low-literacy skilled job categories with icons and localized display titles.
- **Response (200 OK)**:
```json
[
  {
    "id": "DRIVER",
    "code": "DRIVER",
    "name": "Driver (गाड़ी ड्राइवर / ಚಾಲಕ)",
    "icon": "🚗",
    "active": true
  },
  {
    "id": "CARPENTER",
    "code": "CARPENTER",
    "name": "Carpenter (बढ़ई / ಮರಗೆಲಸ)",
    "icon": "🪚",
    "active": true
  }
]
```

### 2.2 Add Category
- **Endpoint**: `POST /categories`
- **Description**: Admin endpoint to append a new job category to allowed dictionary.
- **Request Body**:
```json
{
  "code": "PLUMBER",
  "name": "Plumber (प्लम्बर / ಪ್ಲಂಬರ್)",
  "icon": "🔧"
}
```

---

## 3. Jobs Endpoints

### 3.1 Search & Filter Jobs
- **Endpoint**: `GET /jobs`
- **Query Parameters**:
  - `category` (string, optional): Category code (e.g. `CARPENTER`, `DRIVER`).
  - `keyword` (string, optional): Text query matched against title, description, and category.
  - `location` (string, optional): City or region filter (e.g. `Bengaluru`, `Mysuru`).
  - `status` (string, default `ACTIVE`): `ACTIVE`, `CLOSED`, or `ALL`.
- **Response (200 OK)**:
```json
[
  {
    "id": "job_carp_1",
    "title": "Wood Carpenter (ಮರಗೆಲಸ / Carpenter)",
    "category": "CARPENTER",
    "employerName": "Mysuru Furniture Works",
    "employerId": "emp_3",
    "location": "Bengaluru",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "minSalary": 1200,
    "maxSalary": 1500,
    "salaryType": "DAILY",
    "experience": "3 years",
    "workersRequired": 2,
    "joiningDate": "Immediate joining",
    "description": "Furniture making & repair work in Bengaluru. Daily wages provided.",
    "status": "ACTIVE",
    "postedDate": 1727690000000
  }
]
```

### 3.2 Get Nearby Jobs
- **Endpoint**: `GET /jobs/nearby`
- **Query Parameters**:
  - `lat` (double, default `12.9716`): Latitude coordinate.
  - `lng` (double, default `77.5946`): Longitude coordinate.
- **Response (200 OK)**: Returns active jobs sorted by distance (`distanceKm` field appended).

### 3.3 Get Job by ID
- **Endpoint**: `GET /jobs/{id}`
- **Response (200 OK)**: Job details object.

### 3.4 Create Job
- **Endpoint**: `POST /jobs`
- **Description**: Enforces skilled worker categories (`ALLOWED_CATEGORIES`). Blocks corporate/office jobs.
- **Request Body**:
```json
{
  "title": "House Painter (ಪೇಂಟರ್ ಕೆಲಸ)",
  "category": "PAINTER",
  "employerName": "Bengaluru Paints",
  "employerId": "emp_2",
  "location": "Bengaluru",
  "latitude": 12.9352,
  "longitude": 77.6245,
  "minSalary": 900,
  "maxSalary": 1100,
  "salaryType": "DAILY",
  "experience": "2 years",
  "workersRequired": 3,
  "description": "Wall painting work in Koramangala. Daily payment at 6 PM."
}
```

---

## 4. Job Applications & Voice Endpoints

### 4.1 Apply for Job (Voice or Manual)
- **Endpoint**: `POST /applications` or `POST /applications/voice`
- **Request Body**:
```json
{
  "jobId": "job_carp_1",
  "workerId": "worker_1",
  "workerName": "Pranesh",
  "workerPhone": "9876543210",
  "applicationSource": "VOICE",
  "voiceTranscript": "My name is Pranesh. I have 3 years experience in furniture wood carpentry.",
  "language": "kn-IN"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Application submitted successfully!",
  "application": {
    "id": "app_8f1a2b3c",
    "jobId": "job_carp_1",
    "jobTitle": "Wood Carpenter (ಮರಗೆಲಸ / Carpenter)",
    "workerId": "worker_1",
    "workerName": "Pranesh",
    "status": "APPLIED",
    "applicationSource": "VOICE",
    "appliedAt": 1727705000000
  }
}
```

### 4.2 Check If Applied
- **Endpoint**: `GET /applications/check?jobId={jobId}&workerId={workerId}`
- **Response (200 OK)**:
```json
{
  "applied": true,
  "application": { "id": "app_seed_1", "status": "APPLIED" }
}
```

### 4.3 Get Worker Applications
- **Endpoint**: `GET /applications/my?workerId={workerId}` or `GET /applications/worker/{workerId}`
- **Response (200 OK)**: Array of application history for the specified worker.

### 4.4 Update Application Lifecycle Status (Employer / Admin)
- **Endpoint**: `PUT /applications/{id}/status`
- **Request Body**:
```json
{
  "status": "INTERVIEW_SCHEDULED",
  "interviewDate": "2026-10-02",
  "interviewTime": "10:30 AM",
  "interviewLocation": "Indiranagar Workshop, Bengaluru",
  "employerMessage": "Please bring your original ID card."
}
```
- **Allowed Transitions**:
  - `APPLIED` -> `UNDER_REVIEW` or `REJECTED`
  - `UNDER_REVIEW` -> `INTERVIEW_SCHEDULED` or `HIRED` or `REJECTED`
  - `INTERVIEW_SCHEDULED` -> `HIRED` or `REJECTED`
  - Any Active Status -> `REJECTED`

---

## 5. Worker Profile & Admin Endpoints

### 5.1 Worker Profile
- **Endpoint**: `GET /workers/profile?id={id}`
- **Endpoint**: `PUT /workers/profile`

### 5.2 Admin Pending Worker Verification
- **Endpoint**: `GET /admin/workers/pending`
- **Endpoint**: `PUT /admin/workers/{id}/approve`
- **Endpoint**: `PUT /admin/workers/{id}/reject` (Request Body: `{"reason": "Invalid phone number"}`)

### 5.3 Admin Dashboard Analytics
- **Endpoint**: `GET /admin/stats`
- **Response (200 OK)**:
```json
{
  "pendingWorkersCount": 2,
  "pendingApplicationsCount": 1,
  "totalJobsCount": 18,
  "totalCategoriesCount": 18,
  "totalApplicationsCount": 3
}
```
