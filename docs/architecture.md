# VoiceHire Architecture & System Design

## 1. Executive Summary

VoiceHire (Udyoga Mitra) is an accessible, multi-lingual, voice-first hiring platform engineered specifically for low-literacy skilled blue-collar workers (e.g., drivers, carpenters, plumbers, painters, electricians, masons, cooks) and regional employers across India.

The platform bridges the literacy gap by enabling end-to-end voice-driven job search, profile registration, audio application submission, and interview tracking.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client Tier - Frontend
        User[Worker / Employer / Admin]
        UI[React 18 Single Page App]
        SpeechRec[Web Speech API - Speech-to-Text]
        SpeechSyn[Web Speech API - Text-to-Speech]
        NLP[Voice NLP Engine - Multi-lingual Parser]
        State[Zustand State Store]
    end

    subgraph API & Gateway Tier
        CORS[CORS & Security Filter]
        Boot[Spring Boot 3.2 Web Layer]
        AppController[SimpleApplication REST Controller]
    end

    subgraph Business Logic & In-Memory DB
        AuthService[Auth & User Management]
        JobService[Job Matching & Spatial Engine]
        AppService[Application Lifecycle Machine]
        CategoryService[Allowed Skill Category Validator]
        DataStore[(In-Memory Concurrent Data Stores)]
    end

    subgraph External Infrastructure
        Mongo[(MongoDB 7.0 Persistence Store)]
        Express[(Mongo Express Admin Dashboard)]
    end

    User <--> UI
    UI <--> SpeechRec
    UI <--> SpeechSyn
    UI <--> NLP
    UI <--> State
    UI <-->|HTTP / REST JSON| CORS
    CORS --> Boot
    Boot --> AppController
    AppController --> AuthService
    AppController --> JobService
    AppController --> AppService
    AppController --> CategoryService
    AuthService <--> DataStore
    JobService <--> DataStore
    AppService <--> DataStore
    DataStore <.-> Mongo
    Mongo <.-> Express
```

---

## 3. Core System Components

### 3.1 Frontend Architecture (`/frontend`)
- **Framework**: React 18 boosted by Vite for ultra-fast hot module replacement.
- **Routing**: React Router 6 providing responsive view orchestration for Worker, Employer, and Admin portals.
- **Voice Subsystem**:
  - `useVoiceRecognition.js`: Custom hook interfacing with browser `webkitSpeechRecognition` or native Speech API.
  - `voiceNLP.js`: Local rule-assisted Natural Language Processing engine supporting 5 languages (`kn-IN`, `hi-IN`, `te-IN`, `ta-TN`, `en-IN`). Parses spoken voice inputs into intent (`SEARCH_CATEGORY`, `APPLY_JOB`, `CHECK_APPLICATION_STATUS`, `CONFIRM`, `CANCEL`) and extracts entities (job categories and geographical cities).
- **State Management**: Zustand store for client-side authentication, pending voice recordings, and active filters.

### 3.2 Backend Architecture (`/backend`)
- **Framework**: Spring Boot 3.2.0 executing on Java 17 LTS.
- **Controller & Service Layer**: `SimpleApplication.java` handles REST endpoints, low-literacy category validation, geographic distance calculation (Haversine formula), and in-memory transactional database operations (`USERS_DB`, `JOBS_DB`, `APPLICATIONS_DB`).
- **Category Enforcement**: Enforces `ALLOWED_CATEGORIES` (18 skilled worker categories), automatically rejecting corporate/white-collar postings to maintain platform focus.

---

## 4. Application Status Lifecycle Machine

```mermaid
stateDiagram-v2
    [*] --> APPLIED : Worker Submits Application (Voice / Manual)
    APPLIED --> UNDER_REVIEW : Employer Reviews Candidate Profile
    APPLIED --> REJECTED : Admin or Employer Rejects
    UNDER_REVIEW --> INTERVIEW_SCHEDULED : Employer Schedules Interview
    UNDER_REVIEW --> REJECTED : Employer Rejects
    INTERVIEW_SCHEDULED --> HIRED : Employer Selects Candidate
    INTERVIEW_SCHEDULED --> REJECTED : Candidate Not Selected
    HIRED --> [*]
    REJECTED --> [*]
```

---

## 5. Sequence Diagram: Voice Application Flow

```mermaid
sequenceDiagram
    autonumber
    actor Worker as Skilled Worker
    participant Mic as Voice Recognition Hook
    participant NLP as Voice NLP Engine
    participant React as React Frontend UI
    participant Backend as Spring Boot API
    participant DB as Data Store

    Worker ->> Mic: Speaks "I want carpenter job in Bengaluru"
    Mic ->> NLP: Raw Transcript ("carpenter bengaluru")
    NLP ->> NLP: Normalize & Parse Intent
    NLP -->> React: Intent: SEARCH_CATEGORY, Entity: {category: "CARPENTER", location: "Bengaluru"}
    React ->> Backend: GET /jobs?category=CARPENTER&location=Bengaluru
    Backend ->> DB: Query Jobs DB
    DB -->> Backend: Matching Jobs Array
    Backend -->> React: List of Active Carpenter Jobs
    React ->> Worker: Speaks TTS + Displays Jobs
    Worker ->> Mic: Speaks "Apply for first job"
    Mic ->> Backend: POST /applications (Source: VOICE, Transcript: "Apply for first job")
    Backend ->> DB: Insert Application Record (Status: APPLIED)
    Backend -->> React: Application Created Confirmation
    React ->> Worker: Speaks "Application submitted successfully!"
```

---

## 6. Key Design Decisions

1. **Voice-First Accessibility**: Voice input & audio feedback are primary UI elements rather than secondary additions, enabling non-literate workers to browse and apply without typing.
2. **Strict Category Guardrails**: Excludes corporate/office jobs to guarantee relevant listings for skilled blue-collar trade workers.
3. **Multi-Lingual Synonyms**: NLP engine uses comprehensive phonetic and regional script dictionaries (Kannada, Hindi, Telugu, Tamil, English) to match local spoken terms to standardized job codes.
