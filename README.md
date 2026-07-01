# Community App

Full-stack monorepo for a mobile community management app. The mobile UI is built with Expo React Native and a WhatsApp-inspired structure, while the backend is a Java Spring Boot API with security, validation, OpenAPI, PostgreSQL configuration, and modular community workflows.

## Structure

```text
community-app/
  apps/
    mobile/   Expo React Native app
      app/    Expo Router screens and route groups
      src/    Shared UI, services, state, schemas, and utilities
    backend/  Spring Boot API
      src/main/java/com/communityapp/modules/
        accessrequests/
        auth/
        communities/
        dashboard/
        events/
        members/
        notifications/
        posts/
        users/
  packages/
    shared/   Shared TypeScript types and constants
```

## Prerequisites

- Node.js 20+
- npm 10+
- Java 21
- PostgreSQL 14+

## Mobile Setup

```bash
cd apps/mobile
npm install
npx expo start
npx expo start --web
npm run typecheck
```

Set `EXPO_PUBLIC_API_BASE_URL` in `apps/mobile/.env` when the API is not on browser localhost. Do not hardcode API URLs in source files.

```text
Web browser:     EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
Android emulator: EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api
Physical phone: EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:8080/api
```

Included mobile foundations:

- Expo Router routes under `apps/mobile/app`
- Main tab routes under `apps/mobile/app/tabs`
- Post routes including `apps/mobile/app/posts/my-posts.tsx`
- TypeScript path alias `@/*`
- NativeWind setup
- Zustand stores
- Axios API client with SecureStore token injection
- React Hook Form + Zod validation
- Loading, empty, and error states for backend-backed screens
- Web entry page for browser visualization via Expo Web

## Backend Setup

The backend uses Maven Wrapper, so a global Maven install is not required. For local demo/stability, use the `local` profile; it runs with in-memory H2 and does not require PostgreSQL.

Windows build:

```powershell
cd apps/backend
.\mvnw.cmd clean install
```

Windows run:

```powershell
cd apps/backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

PowerShell helper:

```powershell
cd apps/backend
powershell -ExecutionPolicy Bypass -File .\start-backend.ps1
```

Health check:

```text
http://localhost:8080/api/health
```

For PostgreSQL development, create a PostgreSQL database and user, then configure environment variables from `apps/backend/.env.example`.

PowerShell example:

```powershell
cd apps/backend
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DATABASE_URL="jdbc:postgresql://localhost:5433/community_app"
$env:DATABASE_USERNAME="community_app"
$env:DATABASE_PASSWORD="Abhi_1208"
$env:JWT_SECRET="replace-with-at-least-32-byte-secret"
mvn spring-boot:run
```

Build and test commands:

```powershell
cd apps/backend
.\mvnw.cmd clean install
.\mvnw.cmd test
```

OpenAPI endpoints:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- App health: `http://localhost:8080/api/health`
- Health: `http://localhost:8080/api/actuator/health`

Included backend foundations:

- Java 21 and Spring Boot
- Spring Security with stateless configuration
- JWT service placeholder
- PostgreSQL DataSource configured from environment variables
- Spring Data JPA / Hibernate
- Lombok and MapStruct dependencies
- Bean Validation
- Global exception handler
- Role constants and method security
- Module folders for auth, users, communities, access requests, posts, events, notifications, members, and dashboard

## Root Scripts

```bash
npm run mobile
npm run mobile:web
npm run mobile:typecheck
npm run backend
npm run backend:test
```

## Notes

Backend URLs, database credentials, and JWT secrets must come from environment configuration. Mobile API access uses `EXPO_PUBLIC_API_URL` through the centralized Axios client.
