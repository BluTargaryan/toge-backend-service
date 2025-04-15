import * as AWS from "aws-sdk";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  //Create DynamoDB client
  export const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // Create table if it doesn't exist
export const createTable = async (
    tableName: string,
    keySchema: AWS.DynamoDB.KeySchema,
    attributeDefinitions: AWS.DynamoDB.AttributeDefinitions
) => {
    const dynamoDb = new AWS.DynamoDB();
    
    const params = {
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    try {
        await dynamoDb.createTable(params).promise();
        console.log(`Table ${tableName} created successfully!`);
      } catch (error: any) {
        if (error.code === 'ResourceInUseException') {
          console.log(`Table ${tableName} already exists.`);
        } else {
          console.error(`Error creating table: ${error.message}`);
        }
      }
  
}
