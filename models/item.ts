import {dynamoDB }from '../config/dynamodb'
import {v4 as uuidv4} from 'uuid'
import {createTable} from '../config/dynamodb'

const TABLE_NAME = 'Items'

//create table if it does not exist
export const createItemTable = async () => {
    
    await createTable(TABLE_NAME, 
        [{AttributeName: 'id', KeyType: 'HASH'}],
        [{AttributeName: 'id', AttributeType: 'S'}],
    )
}

//create item
export const createItem = async (itemData:any) => {
   const params={
    TableName: TABLE_NAME,
    Item: {
        id: uuidv4(),
        ...itemData,
        createdAt: new Date().toISOString(),
    }
   }
   await dynamoDB.put(params).promise()
   return params.Item
}

// Get item by ID
export const getItemById = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };
  
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  };

  // Get all items
export const getAllItems = async () => {
    const params = {
      TableName: TABLE_NAME
    };
  
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  };

// Update item
export const updateItem = async (id:string, itemData:any) => {
    const params: {
      TableName: string;
      Key: { id: string };
      UpdateExpression: string;
      ExpressionAttributeNames: { [key: string]: string };
      ExpressionAttributeValues: { [key: string]: any };
      ReturnValues: string;
    } = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: 'ALL_NEW'
    };
  
    let prefix = ' ';
    
    Object.keys(itemData).forEach(key => {
      params.UpdateExpression += `${prefix}#${key} = :${key}`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      params.ExpressionAttributeValues[`:${key}`] = itemData[key];
      prefix = ', ';
    });
  
    params.UpdateExpression += ', #updatedAt = :updatedAt';
    params.ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
    params.ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  };

  // Delete item
export const deleteItem = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };
  
    const result = await dynamoDB.delete(params).promise();
    return result.Attributes;
  };