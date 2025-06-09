# Hello World Lambda Function

A simple AWS Lambda function that returns "Hello World" for any incoming request.

## Project Structure

```
src/
  ├── handlers/       # Lambda handlers
  ├── services/      # Business logic
  └── index.ts       # Main entry point
```

## Prerequisites

- Node.js 18 or later
- Docker (for building and running the container)
- AWS CLI (for deployment)

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Run linting:
```bash
npm run lint
```

## Docker

Build the Docker image:
```bash
docker build -t hello-world-lambda .
```

## Deployment

1. Authenticate to AWS ECR:
```bash
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com
```

2. Tag and push the image:
```bash
docker tag hello-world-lambda:latest YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/hello-world-lambda:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/hello-world-lambda:latest
```

3. Update the Lambda function to use the new image version through the AWS Console or CLI.

## API Response

The API will return a JSON response in the following format:

```json
{
  "message": "Hello World"
}
``` 