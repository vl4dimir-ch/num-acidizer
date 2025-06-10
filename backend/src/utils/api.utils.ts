import { APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCode } from './constants/http.status-codes';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Content-Type': 'application/json'
} as const;

interface ApiResponse {
  statusCode: HttpStatusCode;
  body: Record<string, unknown>;
}

export interface ErrorResponse {
  message: string;
  statusCode: HttpStatusCode;
  code?: string;
}

export function createApiResponse({ statusCode, body }: ApiResponse): APIGatewayProxyResult {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

export function createSuccessResponse<T>(data: T): APIGatewayProxyResult {
  return createApiResponse({
    statusCode: 200,
    body: { data }
  });
}

export function createErrorResponse(error: ErrorResponse): APIGatewayProxyResult {
  return createApiResponse({
    statusCode: error.statusCode,
    body: {
      message: error.message,
      ...(error.code && { code: error.code })
    }
  });
} 