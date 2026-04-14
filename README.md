# ReliefOps: Crisis Relief Coordination Platform (Capstone Project Report)

## Overview

ReliefOps is a capstone-level **crisis relief coordination** web application. Designed for disaster scenarios, it solves critical operational challenges:
- Volunteers don't know where to go.
- Shelters are unaware of incoming capacity.
- Resources (food, beds, medicine) are misallocated.
- High-priority cases get delayed due to duplicate requests.

Our system solves this by introducing:
- Real-time resource tracking and matching engine
- Intelligent allocation strategies (Greedy vs. Severity-first)
- Priority-based queueing handling with conflict-free distribution
- Admin-level control center with a real-time tracking dashboard
- Role-Based Access Control (RBAC)

This repository implements the architecture as a **Next.js (App Router) monolith** with a highly structured **domain layer** (`src/domain`) of TypeScript classes—aligning completely with advanced OOP, design patterns, SOLID principles, and UML methodologies.

## Tech Stack

| Layer | Technology |
|--------|------------|
| Language | TypeScript |
| Framework | Next.js 15 (App Router, React 19) |
| UI & Styling | Tailwind CSS |
| Server state / Mutations | TanStack React Query |
| Client global state | Redux Toolkit |
| Auth | NextAuth.js (Credentials + JWT) |
| Database | MongoDB via Mongoose (with `mongodb-memory-server` fallback for zero-config demo execution) |
| Queue System Concept | Expressed via DB queries on `status: QUEUED` sorted by severity |
| Map / Dispatch View | Mapbox Static API |
| Tests | Jest + next/jest |

## Setup and Installation

### Prerequisites
- Node.js 20+ recommended.
- **Zero-Config Execution**: The system uses `mongodb-memory-server` out-of-the-box. You DO NOT need to configure a local MongoDB instance to test this project—it spins up an in-memory replica automatically!

### Environment Initialization
Copy `.env.local` (or create it in root) with an optional setup:
```env
NEXTAUTH_SECRET=super_secret_key
NEXTAUTH_URL=http://localhost:3000
# MONGODB_URI is intentionally omitted to trigger zero-config in-memory mode
```

### Install and Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## System Design and Architecture

### Architecture Layers
- **`src/app`**: Presentation, API Route Handlers.
- **`src/domain`**: Pure OO domain models and design patterns (`User`, `CrisisRequest`, `RequestFactory`, `ObserverManager`, etc).
- **`src/services`**: Application use cases (`AllocationService`, `RequestService`).
- **`src/components`**: UI layer driven by Tailwind.

### Load Handling & System Design Strategy
- **Horizontal Scaling capability**: All API route handlers are stateless, relying on signed JWTs for session management.
- **Priority Queue Implementation**: A virtual priority queue sorts requests. High severity is loaded `ORDER BY severity DESC`. 
- **Conflict Resolution**: `reserveOneUnit` inside `ResourceRepository` performs an atomic DB write operation using `$inc: { quantityAvailable: -1 }` combined with `quantityAvailable: { $gt: 0 }`. It employs a compensation strategy (rollback `releaseOneUnit`) if downstream allocation operations fail, ensuring bulletproof multi-admin concurrent matching sequences.

## Software Engineering Principles

### Object-Oriented Programming (OOP)
- **Abstraction / Inheritance**: `User` acts as an abstract base class inherited by `Citizen`, `Volunteer`, and `Admin`. `CrisisRequest` operates as the base for `MedicalRequest`, `ShelterRequest`, and `FoodRequest`.
- **Polymorphism**: The method `priorityWeight()` behaves uniquely per subclass representing different urgency weights.
- **Encapsulation**: Details of Mongoose drivers are completely sealed inside Repository modules (like `RequestRepository.ts`), exposing clean interfaces instead.

### SOLID Principles Applied
- **Single Responsibility (SRP)**: Services handle orchestration (`AllocationService`), Repositories handle database retrieval (`RequestRepository`), and Routes act strictly as controllers.
- **Open/Closed (OCP)**: Adding a new matching algorithm (e.g., `DistanceStrategy`) requires implementing `AllocationStrategy` without mutating the core `AllocationService`.
- **Liskov Substitution (LSP)**: All Request types map flawlessly when stored and pulled from the Factory.
- **Interface Segregation (ISP)**: Interfaces `IRequestRepository`, `IResourceRepository`, and `IUserRepository` explicitly define strictly necessary operational contracts.
- **Dependency Inversion (DIP)**: Our application relies on abstract interfaces (`IRequestRepository`) rather than concrete class types.

### Design Patterns Used
1. **Strategy Pattern (Matching Algorithm)**: `AllocationStrategy` interface resolves at runtime using the `GreedyStrategy` or `SeverityStrategy`.
2. **Factory Pattern**: `RequestFactory` abstracts the complicated lifecycle mapping when mapping JSON inputs to typed request entities.
3. **State Pattern**: `RequestStateMachine` dictates rules and strict legal state transitions (`CREATED` → `VALIDATED` → `QUEUED` → `ALLOCATED`).
4. **Observer Pattern**: `DashboardObserver` and `ObserverManager` listen asynchronously to dispatch matching payload updates to the live map without coupling to API logic.
5. **Singleton Pattern**: The MongoDB loader and configuration engine maintain a persistent thread connection to avoid thrashing.

---

## UML Diagrams (Visual Logic Architecture)

### 1. Class Diagram
```
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
  class ShelterManager
  
  User <|-- Citizen
  User <|-- Volunteer
  User <|-- Admin
  User <|-- ShelterManager
  
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

### 2. ER Diagram (Data Model)
```
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
    float lat
    float lng
  }
  RESOURCES {
    ObjectId _id
    string name
    string type
    int quantityAvailable
    float lat
  }
  ALLOCATIONS {
    ObjectId _id
    string requestId FK
    string resourceId FK
    string strategy
  }
  
  USERS ||--o{ REQUESTS : creates
  REQUESTS ||--o{ ALLOCATIONS : receives
  RESOURCES ||--o{ ALLOCATIONS : supplies
```

### 3. Sequence Diagram (Allocation Request matching logic)
```
sequenceDiagram
  autonumber
  actor Admin
  participant API
  participant AllocationService as AllocSvc
  participant AllocationStrategy as Strategy
  participant ResourceRepository as ResRepo
  participant Database as MongoDB
  
  Admin->>API: Route hit POST /api/allocate 
  API->>AllocSvc: run(requestId)
  AllocSvc->>Strategy: execute logic allocate(requestId)
  Strategy->>ResRepo: search: findAvailableByType()
  ResRepo-->>Strategy: Available Resource 
  Strategy-->>AllocSvc: Candidate resourceId
  AllocSvc->>ResRepo: Atomic reserveOneUnit(resourceId)
  alt Out of Stock OR Write lock race condition
      ResRepo-->>AllocSvc: false
      AllocSvc-->>API: 409 Resource Unavailable Error
  else Successfully locked
      AllocSvc->>Database: Save Record linking Request+Resource
      AllocSvc->>Database: Request Object updateState(ALLOCATED)
      AllocSvc-->>API: 200 Success Return 
  end
  API-->>Admin: Updates Dashboard with Results
```

### 4. Use Case Diagram
```
usecaseDiagram
  actor Citizen as C
  actor Volunteer as V
  actor Admin as A
  actor ShelterManager as SM
  
  usecase "Submit Request" as UR
  usecase "Track Status" as TS
  usecase "Complete Verification Check" as VC
  usecase "View Operations Map" as Dash
  usecase "Allocate Engine" as Alloc
  usecase "Stock Resources" as Stock
  
  C --> UR
  C --> TS
  V --> VC
  V --> TS
  A --> Dash
  A --> Alloc
  A --> Stock
  SM --> Dash
  SM --> Alloc
  SM --> Stock
```

---
