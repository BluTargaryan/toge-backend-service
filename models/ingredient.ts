import {dynamoDB }from '../config/dynamodb'
import {v4 as uuidv4} from 'uuid'
import {createTable} from '../config/dynamodb'

const TABLE_NAME = 'Ingredients'

//create table if it does not exist
export const createIngredientTable = async () => {
    
    await createTable(TABLE_NAME, 
        [{AttributeName: 'id', KeyType: 'HASH'}],
        [{AttributeName: 'id', AttributeType: 'S'}],
    )
}

//create item
export const createIngredient = async (ingredientData:any) => {
   if (!ingredientData || !ingredientData.title) {
     throw new Error('Title is required');
   }

   const params = {
    TableName: TABLE_NAME,
    Item: {
        id: uuidv4(),
        ...ingredientData,
        title: ingredientData.title.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
    }
   }

   try {
     await dynamoDB.put(params).promise();
     return params.Item;
   } catch (error) {
     console.error('Error creating ingredient:', error);
     throw new Error('Failed to create ingredient');
   }
}

// Get item by ID
export const getIngredientById = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };
  
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  };

  // Get item by title
export const getIngredientByTitle = async (title:string) => {
  if (!title) {
    throw new Error('Title is required');
  }

  const searchTerm = title.toLowerCase().trim();
  
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'contains(#title, :title)',
    ExpressionAttributeNames: {
      '#title': 'title'
    },
    ExpressionAttributeValues: {
      ':title': searchTerm
    }
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items || [];
  } catch (error) {
    console.error('Error searching for ingredient:', error);
    throw new Error('Failed to search for ingredient');
  }
};

  // Get all items
export const getAllIngredients = async () => {
    const params = {
      TableName: TABLE_NAME
    };
  
    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  };

// Update item
export const updateIngredient = async (id:string, ingredientData:any) => {
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
    
    Object.keys(ingredientData).forEach(key => {
      params.UpdateExpression += `${prefix}#${key} = :${key}`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      params.ExpressionAttributeValues[`:${key}`] = ingredientData[key];
      prefix = ', ';
    });
  
    params.UpdateExpression += ', #updatedAt = :updatedAt';
    params.ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
    params.ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  };

  // Delete item
export const deleteIngredient = async (id:string) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };
  
    const result = await dynamoDB.delete(params).promise();
    return result.Attributes;
  };