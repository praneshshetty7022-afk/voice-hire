# Quick Start - Fix "Refused to Connect" Error

## Immediate Solution: Basic Connection Test

### Step 1: Start Simple Backend
The backend has been temporarily configured to work without MongoDB for testing:

```bash
cd voicehire/backend
mvn spring-boot:run
```

### Step 2: Test Backend Connection
Open browser and visit:
- http://localhost:8080/api/health
- http://localhost:8080/api/test

If these work, the backend is running correctly.

### Step 3: Start Frontend
```bash
cd voicehire/frontend
npm install
npm run dev
```

### Step 4: Test Frontend Connection
Open browser and visit:
- http://localhost:3000

### Step 5: Check API Proxy
The frontend is configured to proxy `/api` requests to `http://localhost:8080`

## If Still Getting "Refused to Connect":

### Check Backend is Running:
```bash
# Windows
netstat -ano | findstr :8080

# If no output, backend is not running
# If output shows process, check it's the Spring Boot process
```

### Check Frontend Configuration:
Edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Add this for debugging
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending request to target:', req.url);
          });
        }
      },
    },
  },
})
```

### Alternative: Direct API Testing
Use browser or Postman to test:
- GET http://localhost:8080/api/health
- GET http://localhost:8080/api/test

## Common Issues:

1. **Port Already in Use:**
   - Change backend port in `application.properties`: `server.port=8081`
   - Update frontend proxy to match

2. **Firewall Blocking:**
   - Allow Java/Spring Boot through Windows Firewall
   - Temporarily disable firewall for testing

3. **Network Issues:**
   - Try using `localhost` instead of `127.0.0.1` or vice versa
   - Check antivirus software

## Once Basic Connection Works:

1. **Fix MongoDB Connection:**
   - Install MongoDB locally or use MongoDB Atlas
   - Re-enable MongoDB in `VoiceHireApplication.java`
   - Update connection string in `application.properties`

2. **Fix Lombok Issues:**
   - Add manual getters/setters to entity classes
   - Or properly configure Lombok in IDE
   - Or use alternative like EclipseJDT

3. **Re-enable Full Features:**
   - Authentication controllers
   - Job management
   - Voice services

## Current Status:
- ✅ Basic backend controller created (TestController)
- ✅ MongoDB temporarily disabled for testing
- ✅ Simplified application configuration
- ⏳ Testing basic connection
- ⏳ Will add MongoDB back once connection works
