# Acidizer Backend

A serverless backend service built with AWS Lambda and DynamoDB, providing a simple counter API.

## Tech Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: AWS Lambda
- **Database**: Amazon DynamoDB

## Main Dependencies

- `aws-lambda`: AWS Lambda runtime
- `@aws-sdk/client-dynamodb`: DynamoDB client
- `@aws-sdk/lib-dynamodb`: DynamoDB utilities

## API Endpoints

- `GET /counter`: Get current counter value
- `POST /counter/increment`: Increment counter
- `POST /counter/decrement`: Decrement counter
