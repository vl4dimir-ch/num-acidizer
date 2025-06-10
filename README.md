# Acidizer - Distributed Counter Application

🚀 **Live Demo**: [https://d21hsg4tpvunc4.cloudfront.net](https://d21hsg4tpvunc4.cloudfront.net/)

## Overview

Acidizer is a modern, cloud-native distributed counter application built with a React frontend and serverless backend. The application demonstrates a simple but robust counter that can be incremented and decremented with smooth animations, persistent state, and proper error handling.

## What It Does

- **Distributed Counter**: A shared counter that persists across sessions and users
- **Real-time Updates**: Smooth animations and immediate UI feedback
- **Concurrent Safety**: Handles multiple users safely with DynamoDB's atomic operations
- **Error Handling**: Graceful error handling with retry mechanisms
- **Rate Limiting**: Built-in API rate limiting to prevent abuse
- **Responsive Design**: Mobile-first, responsive UI with Tailwind CSS

## Technology Stack

### Frontend
- **React 19** with **TypeScript** - Modern UI library with type safety
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management and caching
- **ESLint** - Code linting and formatting

### Backend
- **Node.js** with **TypeScript** - Type-safe server-side JavaScript
- **AWS Lambda** - Serverless compute platform
- **DynamoDB** - NoSQL database for counter storage
- **API Gateway** - RESTful API management
- **Docker** - Containerized deployment via ECR

### Infrastructure
- **Terraform** - Infrastructure as Code (IaC)
- **AWS CloudFormation** - Resource provisioning
- **CloudFront** - Global content delivery network
- **S3** - Static website hosting
- **CloudWatch** - Monitoring and logging
- **GitHub Actions** - CI/CD pipeline

### Core Components

**Frontend**:
- React application hosted on S3
- Served via CloudFront CDN

**Backend**:
- API Gateway for REST endpoints
- Lambda for serverless compute
- DynamoDB for data storage

**Monitoring**:
- CloudWatch for logs and metrics

## Key Features

### Backend Features
- **Atomic Operations**: Uses DynamoDB conditional updates for race condition safety
- **Boundary Checks**: Counter limited between 0 and 1 billion
- **Error Handling**: Proper error responses with meaningful messages
- **Rate Limiting**: API Gateway throttling (5 requests/second, 10 burst)
- **Monitoring**: CloudWatch integration for metrics and alerts

### Frontend Features
- **Optimistic Updates**: UI updates immediately before server confirmation
- **Smooth Animations**: Custom counter animation with 60fps updates
- **Loading States**: Visual feedback during API calls
- **Error Recovery**: Automatic retry mechanisms with user feedback
- **Responsive Design**: Works across all device sizes

## What Could Be Improved

### 1. **Authentication & Authorization**
- **Current State**: No user authentication - anyone can modify the counter
- **Improvement**: Add user authentication (AWS Cognito, Auth0, or similar)
- **Benefits**: User-specific counters, access control, audit trails

### 2. **Real-time Updates**
- **Current State**: Counter updates only when user performs actions
- **Improvement**: WebSocket connection or Server-Sent Events for real-time updates
- **Benefits**: Multiple users would see live updates from other users

### 3. **Database Optimization**
- **Current State**: Simple DynamoDB table without advanced features
- **Improvements**:
  - Add DynamoDB Streams for audit logging
  - Implement Point-in-Time Recovery
  - Add Global Tables for multi-region support
  - Consider caching layer (ElastiCache/Redis)

### 4. **Enhanced Monitoring & Observability**
- **Current State**: Basic CloudWatch logging
- **Improvements**:
  - Add distributed tracing (AWS X-Ray)
  - Custom metrics and dashboards
  - Error tracking (Sentry, Rollbar)
  - Performance monitoring (RUM)
  - Alerting on critical thresholds

### 5. **Testing Strategy**
- **Current State**: Minimal testing setup
- **Improvements**:
  - Unit tests for all components and services
  - Integration tests for API endpoints
  - End-to-end tests with Playwright/Cypress
  - Load testing for scalability validation
  - Contract testing between frontend and backend

### 6. **Security Enhancements**
- **Current State**: Basic API Gateway security
- **Improvements**:
  - API key authentication
  - WAF (Web Application Firewall)
  - Rate limiting per user/IP
  - CORS configuration refinement
  - Security headers (HSTS, CSP, etc.)

### 7. **Developer Experience**
- **Current State**: Basic development setup
- **Improvements**:
  - Local development with Docker Compose
  - Hot reload for backend development
  - API documentation (OpenAPI/Swagger)
  - Better error messages and debugging
  - Development environment provisioning

### 8. **Scalability & Performance**
- **Current State**: Single-region deployment
- **Improvements**:
  - Multi-region deployment
  - Auto-scaling configuration
  - CDN optimization
  - Bundle size optimization
  - Database read replicas
  - Implement caching strategies

### 9. **Infrastructure Improvements**
- **Current State**: Basic Terraform setup
- **Improvements**:
  - Terraform modules for reusability
  - Multi-environment support (dev/staging/prod)
  - Terraform state management (S3 backend)
  - Infrastructure testing (Terratest)
  - Cost optimization policies
  - Major refactoring

## Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Terraform installed
- Docker (for backend deployment)

### Local Development
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run start
```

## Project Structure
```
acidizer/
├── frontend/           # React frontend application
├── backend/           # Node.js Lambda backend
├── infrastructure/    # Terraform infrastructure code
├── .github/          # GitHub Actions workflows
└── scripts/          # Deployment and utility scripts
```

## License

This project is open source and available under the [MIT License](LICENSE).
