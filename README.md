# 🚀 Choreo Microservices Orchestration System

A production-quality microservices system demonstrating **Distributed Orchestration**, **Resilience Patterns**, and **Enterprise Observability** on WSO2 Choreo.

## 🏗️ Enterprise Architecture

Our system is designed with a robust directed-flow topology, utilizing an API Gateway for security and centralized orchestration for complex business logic. These diagrams were validated using the **Choreo Dependency Graph** within the production project.

### High-Level Structural Design
```mermaid
graph TD
    Client[Client Browser/Mobile]
    
    subgraph "Public Entry Point"
        Gateway[WSO2 Choreo API Gateway]
    end

    subgraph "Logic Orchestration Layer"
        Orch[Order Orchestrator]
    end

    subgraph "Microservices Layer"
        US[User Service]
        IS[Inventory Service]
        PS[Payment Service]
    end

    subgraph "Configuration Management"
        Env[(.env / Choreo Config)]
    end

    Client --> Gateway
    Gateway --> Orch
    Orch --> US
    Orch --> IS
    Orch --> PS
    
    Env -.-> Orch
    Env -.-> US
    Env -.-> IS
    Env -.-> PS

    style Gateway fill:#3b82f6,color:#fff,stroke:#1d4ed8,stroke-width:2px
    style Orch fill:#10b981,color:#fff,stroke:#059669,stroke-width:2px
    style Env fill:#f59e0b,color:#fff,stroke:#d97706
```

### Advanced Layer (Resilience & Observability)
This view highlights the enterprise patterns implemented: **Timeouts**, **Retry Logic**, and **Distributed Logging**.

```mermaid
graph LR
    subgraph "Traffic Entry"
        GW[API Gateway]
    end

    subgraph "Resilient Orchestrator"
        Orch[Order Orchestrator]
        Logs[[Structured Logs]]
    end

    GW --> Orch
    Orch -.-> Logs

    Orch -- "Timeout: 3000ms" --> US[User Service]
    Orch -- "Timeout: 3000ms" --> IS[Inventory Service]
    
    Orch -- "Retry Strategy (x2)" --> PS[Payment Service]
    PS -- "Retry on Failure" --> PS
    
    IS -- "Error: OUT_OF_STOCK" --> Orch
    PS -- "Error: PAYMENT_FAILED" --> Orch

    style Logs fill:#eee,stroke:#999
    style Orch stroke-dasharray: 5 5
```

### System Sequence Flow (POST /order)
The following sequence flow details the exact lifecycle of a request, including the success and failure branches:

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant G as Choreo Gateway
    participant O as Orchestrator
    participant S as Microservices

    C->>G: POST /order
    G->>O: Forward Request
    Note over O: Log: [ORCHESTRATOR] Incoming Order
    
    O->>S: Call User Service (Validate ID)
    S-->>O: 200 OK
    
    O->>S: Call Inventory (Check Stock)
    alt Out of Stock
        S-->>O: 400 OUT_OF_STOCK
        O-->>C: JSON {"status": "FAILED", "reason": "OUT_OF_STOCK"}
    else In Stock
        S-->>O: 200 OK
    end
    
    O->>S: Call Payment (Process)
    loop Up to 2 Retries
        S-->>O: Payment Attempt
    end
    
    alt Payment Success
        O-->>C: 201 Created {"orderId": "..."}
    else Final Failure
        O-->>C: 500 PAYMENT_FAILED
    end
```

## 🚀 API Demonstration Flow

### 1. Success Case (`POST /order`)
**Request Body:**
```json
{
  "userId": "1",
  "item": "laptop",
  "amount": 1200
}
```
**Response:** `200 OK`
```json
{
  "orderStatus": "CONFIRMED",
  "user": { "id": 1, "name": "Vinod" },
  "inventory": { "item": "laptop", "stock": 15 },
  "payment": { "status": "success", "transactionId": "TXN..." }
}
```

### 2. Out of Stock Case
**Response:** `400 Bad Request`
```json
{
  "orderStatus": "FAILED",
  "reason": "OUT_OF_STOCK",
  "item": "mouse"
}
```

### 3. Payment Failure Case
**Response:** `402 Payment Required`
```json
{
  "orderStatus": "FAILED",
  "reason": "PAYMENT_FAILED",
  "details": "timeout of 3000ms exceeded"
}
```

## 🛠️ Infrastructure & Setup

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Local service port | 8080 |
| `USER_SERVICE_URL` | Endpoint for user-service | `http://localhost:8080` |
| `INVENTORY_SERVICE_URL` | Endpoint for inventory-service | `http://localhost:8081` |
| `PAYMENT_SERVICE_URL` | Endpoint for payment-service | `http://localhost:8082` |

### Choreo Deployment
This project is optimized for WSO2 Choreo. Each directory (`services/`, `orchestrator/`) maps to an independent **Service Component** using the **NodeJS** build preset.

---
*Developed by Perera1325 as a Cloud DevOps Showcase.*
