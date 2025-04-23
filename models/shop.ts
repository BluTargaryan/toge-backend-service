import {dynamoDB }from '../config/dynamodb'
import {v4 as uuidv4} from 'uuid'
import {createTable} from '../config/dynamodb'

const TABLE_NAME = 'Shops'

//create table if it does not exist
export const createShopTable = async () => {
    
    await createTable(TABLE_NAME, 
        [{AttributeName: 'id', KeyType: 'HASH'}],
        [{AttributeName: 'id', AttributeType: 'S'}],
    )
}

//create item
export const createShop = async (shopData:any) => {
   const params={
    TableName: TABLE_NAME,
    Item: {
        id: uuidv4(),
        title: shopData.title.toLowerCase().trim(),
        locationTitle: shopData.locationTitle.toLowerCase().trim(),
        ...shopData,
        createdAt: new Date().toISOString(),
    }
   }
   await dynamoDB.put(params).promise()
   return params.Item
}

// Get item by ID
export const getShopById = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };
  
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  };

  // Get item by title
export const getShopByLocation = async (location:string) => {
  if (!location) {
    throw new Error('Location is required');
  }

  const searchTerm = location.toLowerCase().trim();
  
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'contains(#locationTitle, :locationTitle)',
    ExpressionAttributeNames: {
      '#locationTitle': 'locationTitle'
    },
    ExpressionAttributeValues: {
      ':locationTitle': searchTerm
    }
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error fetching shop by location:', error);
    throw error;
  }
}

  // Get all items
export const getAllShops = async () => {
    const params = {
      TableName: TABLE_NAME
    };
  
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  };

// Update item
export const updateShop = async (id:string, shopData:any) => {
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
    
      Object.keys(shopData).forEach(key => {
      params.UpdateExpression += `${prefix}#${key} = :${key}`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      params.ExpressionAttributeValues[`:${key}`] = shopData[key];
      prefix = ', ';
    });
  
    params.UpdateExpression += ', #updatedAt = :updatedAt';
    params.ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
    params.ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  };

  // Delete item
export const deleteShop = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };
  
    const result = await dynamoDB.delete(params).promise();
    return result.Attributes;
  };