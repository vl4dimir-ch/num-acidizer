import { DynamoDBItem } from "../dynamodb/types.dynamodb";

export type CounterItem = {
  id: string;
  value: number;
} & DynamoDBItem;