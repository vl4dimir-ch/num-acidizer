import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { CounterItem } from './counter.types';
import { COUNTER_CONSTS } from './constants/counter.constants';

export class CounterService {
  private static instance: CounterService;
  private readonly dynamoDBService: DynamoDBService;
  private readonly tableName: string;

  private constructor() {
    this.dynamoDBService = DynamoDBService.getInstance();
    this.tableName = process.env.DYNAMODB_TABLE_NAME || '';
    if (!this.tableName) {
      throw new Error('DYNAMODB_TABLE_NAME environment variable is not set');
    }
  }

  public static getInstance(): CounterService {
    if (!CounterService.instance) {
      CounterService.instance = new CounterService();
    }
    return CounterService.instance;
  }

  async getCurrentValue(): Promise<number> {
    const item = await this.dynamoDBService.getItem(this.tableName, {
      id: COUNTER_CONSTS.COUNTER_ID,
    }) as CounterItem | undefined;

    return item?.value ?? 0;
  }

  async addToCounter(amount: number): Promise<number> {
    try {
      const updateExpression = 'SET #val = if_not_exists(#val, :zero) + :amount';
      const conditionExpression = 'attribute_not_exists(#val) OR (#val BETWEEN :minValue AND :maxValue)';

      const result = await this.dynamoDBService.updateItem(
        this.tableName,
        { id: COUNTER_CONSTS.COUNTER_ID },
        updateExpression,
        {
          ':amount': amount,
          ':zero': 0,
          ':minValue': COUNTER_CONSTS.MIN_VALUE - amount,
          ':maxValue': COUNTER_CONSTS.MAX_VALUE - amount,
        },
        {
          '#val': 'value',
        },
        conditionExpression,
        ReturnValue.UPDATED_NEW
      ) as CounterItem | undefined;

      return result?.value ?? 0;
    } catch (error) {
      if ((error as Error).name === 'ConditionalCheckFailedException') {
        throw new Error('Counter update failed: Value would exceed limits');
      }
      throw error;
    }
  }
}