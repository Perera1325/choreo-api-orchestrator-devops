# 🚀 Choreo Microservices Orchestration (Standalone Version)

A production-quality microservices system demonstrating **Distributed Orchestration**, **Resilience Patterns**, and **Container Orchestration** using Docker.

## 🏗️ Enterprise Architecture

Our system is designed with a robust directed-flow topology, utilizing an API Gateway for security and centralized orchestration for complex business logic. These diagrams reflect the live environment deployed on WSO2 Choreo.

### Enterprise Resource Catalog (Native Graph)
![Choreo Catalog Graph](./images/choreo_catalog_graph.png)
*Figure 1: Official Choreo Architecture Diagram showing project boundaries and service dependencies.*

### High-Level Structural Design
![Choreo Project Overview](./images/choreo_overview.png)
*Figure 2: Live Dependency Graph & Project Overview in WSO2 Choreo.*

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

### 📦 Component Management
![Choreo Components](./images/choreo_components.png)
*Figure 2: Managed microservices status in the Choreo Console.*

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

### 🧪 API Testing & Flow
![Choreo Test Console](./images/choreo_test_console.png)
*Figure 3: Testing the Order Orchestrator using the integrated OpenAPI console.*

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

## ☁️ Cloud vs Local Deployment

| Feature | WSO2 Choreo (Current) | Docker Compose (Standalone) |
|---------|-----------------------|-----------------------------|
| **Deployment** | Managed (Cloud) | Manual (Local/Any VM) |
| **Networking** | Choreo Gateways | Private Docker Network |
| **Scalability** | Automated | Configurable via Compose |
| **Cost** | Free Tier Limits | Zero Cost (Open Source) |

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed on your machine.

### One-Command Run
You can spin up the entire production-style system with a single command:
```bash
docker-compose up --build
```
This will:
1. Build images for all 4 microservices using `Dockerfile`s.
2. Initialize the private microservices network.
3. Start healthchecks for backend services.
4. Expose the Order Orchestrator on `localhost:8080`.

## 📊 Enterprise Observability & CI/CD

Our system utilizes WSO2 Choreo's advanced DevOps capabilities to ensure every deployment is secure, optimized, and verified.

### 🛡️ Automated CI/CD & Security Scan
![Choreo Build Pipeline](./images/choreo_build_pipeline.png)
*Figure 4: Automated build action including environment setup, containerization, and Trivy vulnerability scanning.*

Every commit to the `main` branch triggers a multi-stage pipeline:
1.  **Environment Setup**: Dynamic provisioning of build resources.
2.  **Build Component**: Native Node.js build and optimization.
3.  **Security Scan**: INTEGRATED **Trivy** vulnerability scanning for all container layers.
4.  **Registry Push**: Versioned images pushed to the internal secure registry.

## 🚀 API Demonstration Flow

### POST /order (Success Case)
**Endpoint**: `http://localhost:8080/order`

**Payload**:
```json
{
  "userId": "1",
  "item": "laptop",
  "amount": 1200
}
```

## 📊 Health Monitoring
Each service provides a health status at `/health`:
- `GET http://localhost:8081/health` (Mapping to user-service)
- `GET http://localhost:8082/health` (Mapping to inventory-service)

---
*Transformed from Choreo-native to Open Source Standalone by Perera1325.*
