import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';

import {
  DynamoDBKey,
  DynamoDBItem,
  ExpressionAttributeValues,
  ExpressionAttributeNames
} from './types.dynamodb';

export class DynamoDBService {
  private static instance: DynamoDBService;
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  private constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public static getInstance(): DynamoDBService {
    if (!DynamoDBService.instance) {
      DynamoDBService.instance = new DynamoDBService();
    }
    return DynamoDBService.instance;
  }

  async putItem(tableName: string, item: DynamoDBItem): Promise<void> {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    await this.docClient.send(command);
  }

  async getItem(tableName: string, key: DynamoDBKey): Promise<DynamoDBItem | undefined> {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    const response = await this.docClient.send(command);
    return response.Item;
  }

  async updateItem(
    tableName: string,
    key: DynamoDBKey,
    updateExpression: string,
    expressionAttributeValues: ExpressionAttributeValues,
    expressionAttributeNames?: ExpressionAttributeNames,
    conditionExpression?: string,
    returnValues?: ReturnValue
  ): Promise<DynamoDBItem | undefined> {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ConditionExpression: conditionExpression,
      ReturnValues: returnValues,
    });

    const response = await this.docClient.send(command);
    return response.Attributes;
  }

  async deleteItem(tableName: string, key: DynamoDBKey): Promise<void> {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });

    await this.docClient.send(command);
  }

  async query(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: ExpressionAttributeValues,
    expressionAttributeNames?: ExpressionAttributeNames
  ): Promise<DynamoDBItem[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    });

    const response = await this.docClient.send(command);
    return response.Items || [];
  }

  async scan(tableName: string): Promise<DynamoDBItem[]> {
    const command = new ScanCommand({
      TableName: tableName,
    });

    const response = await this.docClient.send(command);
    return response.Items || [];
  }
}