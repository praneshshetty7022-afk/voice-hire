# VoiceHire Setup Guide - Troubleshooting Connection Issues

## Current Issue: "Refused to Connect"

The "refused to connect" error typically occurs when:
1. Backend server is not running
2. Backend is running on wrong port
3. MongoDB is not accessible
4. CORS configuration issues

## Quick Fix Steps:

### 1. Fix MongoDB Connection
Since Docker is not available, let's use a local MongoDB installation or modify the connection:

**Option A: Install MongoDB locally**
- Download MongoDB from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: Use MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `application.properties`

### 2. Update Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# For local MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/voicehire

# OR for MongoDB Atlas (replace with your connection string)
# spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/voicehire

# Server configuration
server.port=8080
server.servlet.context-path=/api

# JWT configuration
jwt.secret=voicehire-secret-key-change-in-production
jwt.expiration=86400000

# Logging
logging.level.com.voicehire=DEBUG
```

### 3. Simplify Backend (Remove Lombok Issues)
The current code has Lombok compilation issues. For now, let's create a simple working version:

Create a minimal test endpoint to verify connection:

```java
// Create backend/src/main/java/com/voicehire/controller/TestController.java
package com.voicehire.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {
    
    @GetMapping("/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Backend is working!");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
}
```

### 4. Start Backend Without Full Compilation
For now, let's use a simpler approach:

1. Remove the Lombok dependency from pom.xml temporarily
2. Add manual getters/setters to critical classes only
3. Or use Spring Boot without Lombok

### 5. Frontend Configuration
Ensure `frontend/vite.config.js` has correct proxy:

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### 6. Start Services in Order:

**Terminal 1 - Backend:**
```bash
cd voicehire/backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd voicehire/frontend
npm install
npm run dev
```

### 7. Test Connection:
- Backend: http://localhost:8080/api/health
- Frontend: http://localhost:3000
- API Test: http://localhost:8080/api/test

## Alternative: Use Memory Database (H2)

If MongoDB is causing issues, temporarily use H2 database:

```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

```properties
# Add to application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

## Next Steps Once Basic Connection Works:

1. Fix Lombok compilation issues by:
   - Adding proper Lombok configuration
   - Or replacing with manual getters/setters
   - Or using a different annotation processor

2. Implement MongoDB properly:
   - Ensure MongoDB is running
   - Test connection with MongoDB Compass
   - Verify connection string

3. Implement full features:
   - Authentication
   - Job management
   - Voice features

## Current Priority:
Get a basic "Hello World" connection working between frontend and backend, then build up functionality step by step.
