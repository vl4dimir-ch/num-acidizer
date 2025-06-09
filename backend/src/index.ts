import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HelloWorldHandler } from './handlers/hello.handler';

const handler = new HelloWorldHandler();
 
export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return handler.handle(event);
}; 