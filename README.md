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
- Maven 3.9+
- PostgreSQL 14+

## Mobile Setup

```bash
npm install
npm --workspace apps/mobile run start
npm --workspace apps/mobile run typecheck
```

Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`. Do not hardcode API URLs in source files.

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

Build and test commands:

```bash
mvn -f apps/backend/pom.xml clean install
mvn -f apps/backend/pom.xml test
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
- Module folders for auth, users, communities, access requests, posts, events, notifications, members, and dashboard

## Root Scripts

```bash
npm run mobile
npm run mobile:typecheck
npm run backend
npm run backend:test
```

## Notes

Backend URLs, database credentials, and JWT secrets must come from environment configuration. Mobile API access uses `EXPO_PUBLIC_API_URL` through the centralized Axios client.
