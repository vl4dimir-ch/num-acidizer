import { APIGatewayProxyResult } from 'aws-lambda';
import { HelloWorldService } from './hello.service';

export class HelloWorldHandler {
  private readonly helloWorldService: HelloWorldService;

  constructor() {
    this.helloWorldService = new HelloWorldService();
  }

  public async handle(): Promise<APIGatewayProxyResult> {
    try {
      const message = await this.helloWorldService.getMessage();
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Internal server error',
        }),
      };
    }
  }
} 