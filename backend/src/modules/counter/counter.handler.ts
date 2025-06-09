import { APIGatewayProxyResult } from 'aws-lambda';
import { CounterService } from './counter.service';
import { COUNTER_ERRORS } from './constants/counter.errors';
import { GLOBAL_ERRORS } from '@/utils/constants/global.errors';

export class CounterHandler {
  private readonly counterService: CounterService;

  constructor() {
    this.counterService = CounterService.getInstance();
  }

  async getCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.getCurrentValue();
      
      return {
        statusCode: 200,
        body: JSON.stringify({ value }),
      };
    } catch (error) {
      console.error('Error getting counter value:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: GLOBAL_ERRORS.INTERNAL_SERVER_ERROR }),
      };
    }
  }

  async incrementCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.addToCounter(1);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ value }),
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('exceed limits')) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: COUNTER_ERRORS.EXCEED_MAX_VALUE }),
        };
      }
      
      console.error('Error incrementing counter:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: GLOBAL_ERRORS.INTERNAL_SERVER_ERROR }),
      };
    }
  }

  async decrementCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.addToCounter(-1);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ value }),
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('exceed limits')) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: COUNTER_ERRORS.EXCEED_MIN_VALUE }),
        };
      }
      
      console.error('Error decrementing counter:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: GLOBAL_ERRORS.INTERNAL_SERVER_ERROR }),
      };
    }
  }
}