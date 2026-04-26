<div align="center">

# 🚨 ReliefOps

### Crisis Relief Coordination Platform

**A full-stack disaster response system that connects citizens, volunteers, and admins — with real-time resource allocation, a live operations dashboard, and a volunteer portal.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-v4-purple?style=for-the-badge&logo=auth0&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29-C21325?style=for-the-badge&logo=jest&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://relief-ops-two.vercel.app/)

<br/>

[Live Demo](https://relief-ops-two.vercel.app/) · [Documentation](#architecture) · [Project Structure](#project-structure) · [Quick Start](#setup--installation) · [Tests](#testing)

---

</div>

## Overview

ReliefOps is a capstone-level **crisis relief coordination** web application built for real disaster scenarios. It solves critical operational challenges:

- Volunteers don't know where to go
- Shelters are unaware of incoming capacity
- Resources (food, beds, medicine) are misallocated
- High-priority cases get delayed due to duplicate requests

**ReliefOps solves this with:**

- Real-time resource tracking and matching engine
- Intelligent allocation strategies — Greedy vs. Severity-first
- Atomic, conflict-free priority-based queuing
- Admin control center with a live map dashboard and allocation event feed
- Volunteer portal with application approval workflow and interest-raising
- Role-Based Access Control (RBAC) enforced at middleware and API layers

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5 |
| Framework | Next.js 15 — App Router, React 19 |
| UI & Styling | Tailwind CSS 3 |
| Server State | TanStack React Query v5 |
| Client State | Redux Toolkit |
| Auth | NextAuth.js v4 — Credentials + JWT |
| Database | MongoDB via Mongoose 8 |
| In-Memory DB | `mongodb-memory-server` (auto fallback when `MONGODB_URI` is absent) |
| Map | Google Maps via `@vis.gl/react-google-maps` |
| Tests | Jest 29 + `jest-environment-jsdom` |

---

## Setup & Installation

### Prerequisites

- **Node.js 20+**
- **Zero-Config Execution** — when `MONGODB_URI` is absent, an in-memory MongoDB instance spins up automatically. No local MongoDB needed.

### Environment Variables

Create `.env.local` in the project root:

```env
# Required
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Optional — omit to use the in-memory MongoDB fallback
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ReliefOps

# Optional — enables the live Google Maps view on the dashboard
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Tests

```bash
npm test
```

---

## Project Structure

```
reliefops/
├── __tests__/
│   └── unit/
│       ├── AllocationStrategy.test.ts
│       ├── RequestFactory.test.ts
│       └── RequestStateMachine.test.ts
├── middleware.ts                        # JWT-based RBAC middleware
└── src/
    ├── app/
    │   ├── (admin)/                     # Dashboard, Requests, Resources, Volunteers
    │   ├── (auth)/                      # Login, Register
    │   ├── (citizen)/                   # Submit Request, Track Status
    │   ├── (volunteer)/                 # Volunteer Portal, Pending Approval
    │   └── api/                         # Route handlers
    │       ├── allocate/
    │       ├── auth/
    │       ├── requests/
    │       ├── resource-requests/
    │       ├── resources/
    │       ├── volunteer-applications/
    │       ├── volunteer-interests/
    │       └── volunteers/
    ├── components/                      # UI — auth, common, dashboard, map, requests
    ├── constants/                       # Roles, enums
    ├── domain/
    │   ├── models/                      # Mongoose schemas
    │   ├── patterns/
    │   │   ├── factory/                 # RequestFactory
    │   │   ├── observer/                # ObserverManager, DashboardObserver
    │   │   ├── singleton/               # MongoDB connection singleton
    │   │   ├── state/                   # RequestStateMachine, RequestStates
    │   │   └── strategy/                # AllocationStrategy, GreedyStrategy, SeverityStrategy
    │   ├── repositories/                # Data access layer + interfaces
    │   ├── request/                     # CrisisRequest, MedicalRequest, ShelterRequest, FoodRequest
    │   └── user/                        # User, Citizen, Volunteer, Admin
    ├── hooks/                           # TanStack Query hooks
    ├── lib/                             # mongodb.ts, auth.ts
    ├── services/                        # Use cases: Allocation, Request, Resource, Volunteer
    ├── store/                           # Redux Toolkit slices
    ├── types/                           # Shared TypeScript types
    └── utils/                           # Validators, distance helpers
```

---

## Architecture

### Layer Responsibilities

| Layer | Path | Role |
|-------|------|------|
| Presentation | `src/app` | Pages + API route controllers |
| Application | `src/services` | Use case orchestration |
| Domain | `src/domain` | Pure OOP models, patterns, interfaces |
| Infrastructure | `src/domain/repositories`, `src/lib` | Mongoose adapters, DB connection |
| UI | `src/components` | Tailwind-driven React components |

### Role-Based Access Control

| Role | Allowed Paths | Capabilities |
|------|--------------|--------------|
| `citizen` | `/submit-request`, `/track` | Submit and track own crisis requests |
| `volunteer` | `/portal` | View requests, raise interest, manage profile |
| `admin` | `/dashboard`, `/requests`, `/resources`, `/volunteers` | Full platform control |
| `shelter_manager` | `/dashboard`, `/resources` | Manage resources, view live dashboard |

### Concurrency & Load Handling

- **Stateless API handlers** — JWT sessions, horizontally scalable with no shared session state
- **Virtual priority queue** — requests sorted by `severity DESC` from DB on `status: QUEUED`
- **Atomic allocation** — `$inc: { quantityAvailable: -1 }` with `{ $gt: 0 }` guard; compensation rollback via `releaseOneUnit()` on any downstream failure
- **Duplicate detection** — requests fingerprinted by `(citizenId, type, locationKey)`

---

## Software Engineering Principles

### Object-Oriented Programming

- **Abstraction / Inheritance** — `User` → `Citizen`, `Volunteer`, `Admin`; `CrisisRequest` → `MedicalRequest`, `ShelterRequest`, `FoodRequest`
- **Polymorphism** — `priorityWeight()` and `getResourceType()` behave uniquely per subclass
- **Encapsulation** — All Mongoose details sealed inside `RequestRepository`, `ResourceRepository`, `UserRepository`

### SOLID Principles

| Principle | How It's Applied |
|-----------|-----------------|
| **S** — Single Responsibility | Services orchestrate; repositories store; routes control |
| **O** — Open/Closed | New strategy (e.g. `DistanceStrategy`) needs only to implement `AllocationStrategy` |
| **L** — Liskov Substitution | All `CrisisRequest` subtypes are interchangeable throughout the domain |
| **I** — Interface Segregation | `IRequestRepository`, `IResourceRepository`, `IUserRepository` are minimal and focused |
| **D** — Dependency Inversion | `AllocationService` depends on abstract interfaces, never on concrete models |

### Design Patterns

| Pattern | Files | Purpose |
|---------|-------|---------|
| Strategy | `AllocationStrategy`, `GreedyStrategy`, `SeverityStrategy` | Swap matching algorithms at runtime |
| Factory | `RequestFactory` | Type-safe creation of `CrisisRequest` subclasses |
| State | `RequestStateMachine`, `RequestStates` | Enforce legal request state transitions |
| Observer | `ObserverManager`, `DashboardObserver` | Push allocation events to dashboard without coupling |
| Singleton | `connectMongo()` in `src/lib/mongodb.ts` | Single persistent Mongoose connection |

---

## UML Diagrams

### Class Diagram

```mermaid
classDiagram
  class User {
    <<abstract>>
    +id: string
    +email: string
    +role: string
  }
  class Citizen
  class Volunteer
  class Admin

  User <|-- Citizen
  User <|-- Volunteer
  User <|-- Admin

  class CrisisRequest {
    <<abstract>>
    +id: string
    +citizenId: string
    +severity: number
    +getResourceType()
    +priorityWeight()
  }
  class MedicalRequest
  class ShelterRequest
  class FoodRequest

  CrisisRequest <|-- MedicalRequest
  CrisisRequest <|-- ShelterRequest
  CrisisRequest <|-- FoodRequest

  class RequestFactory {
    <<static>>
    +create(kind, id, citizenId, severity)
  }
  RequestFactory ..> CrisisRequest : creates

  class AllocationStrategy {
    <<interface>>
    +allocate(requestId)
  }
  class GreedyStrategy
  class SeverityStrategy
  AllocationStrategy <|.. GreedyStrategy
  AllocationStrategy <|.. SeverityStrategy

  class AllocationService {
    -strategy: AllocationStrategy
    +run(requestId, strategyName)
  }
  AllocationService o--> AllocationStrategy
```

### ER Diagram

```mermaid
erDiagram
  USERS {
    ObjectId _id
    string email UK
    string passwordHash
    string role
    string name
  }
  REQUESTS {
    ObjectId _id
    string citizenId FK
    string type
    string status
    int severity
    string description
    float lat
    float lng
    string locationKey
    ObjectId duplicateOf
    bool isResourceRequest
    int unitsNeeded
  }
  RESOURCES {
    ObjectId _id
    string name
    string type
    int quantityAvailable
    float lat
    float lng
    string shelterTag
  }
  ALLOCATIONS {
    ObjectId _id
    string requestId FK
    string resourceId FK
    string strategy
  }
  VOLUNTEERS {
    ObjectId _id
    string userId FK
    string[] skills
    float lat
    float lng
    bool available
  }
  VOLUNTEER_APPLICATIONS {
    ObjectId _id
    string userId FK
    string email
    string name
    string[] skills
    string message
    string status
  }
  VOLUNTEER_INTERESTS {
    ObjectId _id
    string volunteerId FK
    string requestId FK
    string requestType
    int requestSeverity
    string status
  }

  USERS ||--o{ REQUESTS : creates
  USERS ||--o| VOLUNTEERS : "has profile"
  USERS ||--o| VOLUNTEER_APPLICATIONS : submits
  REQUESTS ||--o{ ALLOCATIONS : receives
  RESOURCES ||--o{ ALLOCATIONS : supplies
  VOLUNTEERS ||--o{ VOLUNTEER_INTERESTS : raises
  REQUESTS ||--o{ VOLUNTEER_INTERESTS : attracts
```

### Allocation Sequence

```mermaid
sequenceDiagram
  autonumber
  actor Admin
  participant API
  participant AllocationService as AllocSvc
  participant AllocationStrategy as Strategy
  participant ResourceRepository as ResRepo
  participant Database as MongoDB

  Admin->>API: POST /api/allocate
  API->>AllocSvc: run(requestId, strategyName)
  AllocSvc->>Strategy: allocate(requestId)
  Strategy->>ResRepo: findAvailableByType()
  ResRepo-->>Strategy: Available resources
  Strategy-->>AllocSvc: Candidate resourceId
  AllocSvc->>ResRepo: reserveOneUnit(resourceId) [atomic $inc]
  alt Out of stock or race condition
      ResRepo-->>AllocSvc: false
      AllocSvc-->>API: 409 Resource Unavailable
  else Reserved successfully
      AllocSvc->>Database: AllocationModel.create(...)
      AllocSvc->>Database: Request.updateStatus → ALLOCATED
      AllocSvc->>AllocSvc: observers.notify(allocation event)
      AllocSvc-->>API: 200 { ok: true, resourceId }
  end
  API-->>Admin: Dashboard updates with allocation event
```

### Request State Machine

```mermaid
stateDiagram-v2
  [*] --> CREATED
  CREATED --> VALIDATED
  CREATED --> CANCELLED
  VALIDATED --> QUEUED
  VALIDATED --> CANCELLED
  QUEUED --> ALLOCATED
  QUEUED --> CANCELLED
  ALLOCATED --> IN_PROGRESS
  ALLOCATED --> CANCELLED
  IN_PROGRESS --> COMPLETED
  IN_PROGRESS --> CANCELLED
  COMPLETED --> [*]
  CANCELLED --> [*]
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/requests` | Any role | List requests (filtered by role) |
| `POST` | `/api/requests` | Citizen, Admin | Submit a new crisis request |
| `GET` | `/api/resources` | Any role | List available resources |
| `POST` | `/api/resources` | Admin, Shelter Manager | Add a new resource |
| `POST` | `/api/allocate` | Admin, Shelter Manager | Run the allocation engine |
| `GET` | `/api/volunteers` | Admin | List all volunteers with user info |
| `GET/POST` | `/api/volunteer-applications` | Volunteer / Admin | Apply or manage volunteer applications |
| `GET/POST` | `/api/volunteer-interests` | Volunteer / Admin | Raise or manage interest in a request |
| `GET/POST` | `/api/resource-requests` | Volunteer | Request a resource |
| `POST` | `/api/auth/[...nextauth]` | Public | NextAuth sign-in / sign-out / session |

---

## Testing

Unit tests live in `__tests__/unit/` and cover the core domain logic:

| Test File | What It Covers |
|-----------|---------------|
| `AllocationStrategy.test.ts` | `GreedyStrategy` and `SeverityStrategy` pick logic |
| `RequestFactory.test.ts` | `RequestFactory.create()` returns correct subclass instances |
| `RequestStateMachine.test.ts` | Legal and illegal state transitions |

```bash
npm test
```

---

<div align="center">

Made with ❤️ for disaster relief coordination &nbsp;·&nbsp; Capstone Project 2026

</div>
