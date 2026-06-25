# Community App

Full-stack monorepo for a mobile community management app. The mobile UI is scaffolded with Expo React Native and a WhatsApp-inspired structure, while the backend is a Java Spring Boot API skeleton with security, validation, OpenAPI, PostgreSQL configuration, and module boundaries.

## Structure

```text
community-app/
  apps/
    mobile/   Expo React Native app
    backend/  Spring Boot API
  packages/
    shared/   Shared TypeScript types and constants
```

## Prerequisites

- Node.js 20+
- npm 10+
- Java 21
- Maven 3.9+
- PostgreSQL 14+

## Mobile Setup

```bash
cd community-app/apps/mobile
cp .env.example .env
npm install
npm run start
```

Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`. Do not hardcode API URLs in source files.

Included mobile foundations:

- Expo Router routes under `src/app`
- TypeScript path alias `@/*`
- NativeWind setup
- Zustand stores
- Axios API client with SecureStore token injection
- React Hook Form + Zod example in login
- Expo notifications placeholder for push registration

## Backend Setup

Create a PostgreSQL database and user, then configure environment variables from `apps/backend/.env.example`.

PowerShell example:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/community_app"
$env:DATABASE_USERNAME="community_app"
$env:DATABASE_PASSWORD="community_app"
$env:JWT_SECRET="replace-with-at-least-32-byte-secret"
mvn -f apps/backend/pom.xml spring-boot:run
```

OpenAPI endpoints:

- Swagger UI: `http://localhost:8080/api/docs/swagger`
- OpenAPI JSON: `http://localhost:8080/api/docs/api`
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
- Module folders for auth, users, communities, access requests, posts, events, notifications, and admin

## Root Scripts

```bash
npm run mobile
npm run mobile:typecheck
npm run backend
npm run backend:test
```

## Notes

This is intentionally a production-ready skeleton, not a full business implementation. Authentication, membership workflows, post approval rules, event flows, Firebase Cloud Messaging, and admin behavior are represented with placeholders ready for implementation.
