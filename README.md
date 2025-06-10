# Acidizer - Distributed Counter Application

🚀 **Live Demo**: [https://d1f13y5bzzw2fj.cloudfront.net](https://d1f13y5bzzw2fj.cloudfront.net)

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

## Getting Started

### Prerequisites
- Node.js 20 or newer
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

### Deployment
```bash
# Deploy infrastructure
cd infrastructure
terraform init
terraform plan
terraform apply

# Application is also deployed via GitHub Actions
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
