# Suraksha-XR Backend API Documentation

Base URL (local): http://localhost:5000

## Auth
- POST /api/auth/signup - body: { name, email, password, role? } - returns: { token, user }
- POST /api/auth/login - body: { email, password } - returns: { token, user }

## Modules
- GET /api/modules - public - returns: array of modules
- GET /api/modules/:id - public - returns: single module
- POST /api/modules - requires Auth header - body: { title, description, category, difficulty, arSceneId }
- PUT /api/modules/:id - requires Auth header
- DELETE /api/modules/:id - requires Auth header

## Attempts
- POST /api/attempts - requires Auth header - body: { module, score, passed, timeTakenSeconds, mistakes }
- GET /api/attempts/mine - requires Auth header - returns your own attempts
- GET /api/attempts/module/:moduleId - requires Auth header

## Certificates
- POST /api/certificates/generate - requires Auth header - body: { attemptId, moduleId } - returns a PDF file
- GET /api/certificates/verify/:id - public - returns certificate details

## Admin/Dashboard
- GET /api/admin/stats - requires Auth header - returns: { totalWorkers, totalModules, totalAttempts, passRate, avgScore, avgResponseTime }
- GET /api/admin/recent-activity - requires Auth header - returns last 10 attempts with user/module details
- GET /api/admin/trainees - requires Auth header - returns per-trainee stats: array of { userId, name, email, sessions, avgScore, lastTraining, status }
- GET /api/admin/trends - requires Auth header - returns 7-day aggregated data: array of { date, avgScore, avgResponseTime }

## Sync
- POST /api/sync - requires Auth header - body: { attempts: [ {module, score, passed, timeTakenSeconds, mistakes}, ... ] }

## Authentication
For any "requires Auth header" route, add this header to your request:
Authorization: Bearer <token>
(the token comes from the signup or login response)