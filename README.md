# Choreo Microservices Orchestration (Standalone Version)

This repository contains a production-grade microservices system demonstrating distributed orchestration, resilience patterns, and container orchestration using Docker.

## Engineering Architecture and System Stability

The implementation follows industry-standard engineering practices for distributed systems to ensure reliability and maintainability.

### Resilience and Failover Patterns
- **Timeouts and Retries**: Each service-to-service communication is governed by a 3000ms timeout and an exponential retry mechanism for critical business paths, specifically the payment processing flow.
- **Graceful Shutdown**: Every microservice implements native signal handling for SIGTERM and SIGINT. This ensures that in production environments such as Kubernetes or WSO2 Choreo, the service completes pending requests and terminates network connections cleanly before the process exits.

### Continuous Integration and Deployment Quality
- **GitHub Actions CI**: An automated pipeline validates the integrity of every commit through syntax verification and high-level security audits using npm audit.
- **Vulnerability Scanning**: The system is integrated with Trivy for container-level security scanning within the build pipeline.

---

## System Architecture

The system utilizes a directed-flow topology with a centralized API Gateway and an orchestration layer for complex business logic. These diagrams represent the live environment as deployed on WSO2 Choreo.

### Enterprise Resource Catalog (Native Graph)
![Choreo Catalog Graph](./images/choreo_catalog_graph.png)
*Figure 1: Official Choreo Architecture Diagram showing project boundaries and service dependencies.*

### Structural Design
![Choreo Project Overview](./images/choreo_overview.png)
*Figure 2: Project overview and resource dependency graph within the Choreo environment.*

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

### Component Lifecycle and Management
![Choreo Components](./images/choreo_components.png)
*Figure 2: Status of managed microservice components in the production console.*

### Infrastructure Resilience and Networking
This view illustrates the implementation of timeouts, retry logic, and distributed logging patterns.

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

### API Validation and System Flow
![Choreo Test Console](./images/choreo_test_console.png)
*Figure 3: System validation via the integrated OpenAPI testing interface.*

### Request Lifecycle (POST /order)
The following sequence details the lifecycle of an order request, including conditional branches for inventory and payment status.

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

## Cloud Environment vs Local Infrastructure

| Infrastructure Aspect | WSO2 Choreo (Cloud) | Docker Compose (Local) |
|-----------------------|---------------------|-------------------------|
| Deployment Model | Fully Managed | Container Orchestration |
| Networking | Virtual API Gateway | Private Virtual Network |
| Scalability | Automated Scaling | Vertical Static Limits |
| Cost Model | Usage Based | Infrastructure Neutral |

## Deployment and Local Installation

### Prerequisites
- Docker and Docker Compose must be installed on the host machine.

### Execution Command
The entire system can be initialized with a single command:
```bash
docker-compose up --build
```
This command performs the following operations:
1. Builds local images for all microservices using the provided Dockerfiles.
2. Establishes a private virtual network for container communication.
3. Initiates health monitoring for dependent services.
4. Exposes the Order Orchestrator on host port 8080.

## Observability and Automated CI/CD

The system leverages the WSO2 Choreo DevOps suite to maintain high deployment quality and security.

### Automated Pipeline and Security Scanning
![Choreo Build Pipeline](./images/choreo_build_pipeline.png)
*Figure 4: Automated CI/CD pipeline including environment initialization, container build, and Trivy security auditing.*

Every commit to the main branch triggers the following lifecycle:
1.  **Environment Provisioning**: Deployment of dynamic build resources.
2.  **Container Compilation**: Building and optimizing Node.js images.
3.  **Security Auditing**: Comprehensive scanning for vulnerabilities via Trivy.
4.  **Registry Distribution**: Pushing versioned images to a private secure registry.

## API Interface and Specification

### POST /order (Verification Case)
**Endpoint**: `http://localhost:8080/order`

**Request Payload**:
```json
{
  "userId": "1",
  "item": "laptop",
  "amount": 1200
}
```

## System Health Monitoring
All services provide real-time health diagnostics via the `/health` endpoint:
- **User Service**: `GET http://localhost:8081/health`
- **Inventory Service**: `GET http://localhost:8082/health`

---
*Standalone architecture and system transformation by Perera1325.*
