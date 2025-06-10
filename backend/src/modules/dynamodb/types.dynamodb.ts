export type DynamoDBKey = Record<string, string | number>;
export type DynamoDBItem = Record<string, unknown>;
export type ExpressionAttributeValue = string | number | boolean | null | undefined;
export type ExpressionAttributeValues = Record<string, ExpressionAttributeValue>;
export type ExpressionAttributeNames = Record<string, string>;