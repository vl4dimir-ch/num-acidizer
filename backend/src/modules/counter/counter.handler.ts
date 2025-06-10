import { APIGatewayProxyResult } from 'aws-lambda';
import { CounterService } from './counter.service';
import { COUNTER_ERRORS } from './constants/counter.errors';
import { createSuccessResponse, createErrorResponse } from '../../utils/api.utils';

export class CounterHandler {
  private readonly counterService: CounterService;

  constructor() {
    this.counterService = CounterService.getInstance();
  }

  async getCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.getCurrentValue();
      return createSuccessResponse({ value });
    } catch (error) {
      console.error('Error getting counter value:', error);
      return createErrorResponse(COUNTER_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  async incrementCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.addToCounter(1);
      return createSuccessResponse({ value });
    } catch (error) {
      if (error instanceof Error && error.message.includes('exceed limits')) {
        return createErrorResponse(COUNTER_ERRORS.EXCEED_MAX_VALUE);
      }
      
      console.error('Error incrementing counter:', error);
      return createErrorResponse(COUNTER_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  async decrementCounter(): Promise<APIGatewayProxyResult> {
    try {
      const value = await this.counterService.addToCounter(-1);
      return createSuccessResponse({ value });
    } catch (error) {
      if (error instanceof Error && error.message.includes('exceed limits')) {
        return createErrorResponse(COUNTER_ERRORS.EXCEED_MIN_VALUE);
      }
      
      console.error('Error decrementing counter:', error);
      return createErrorResponse(COUNTER_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}