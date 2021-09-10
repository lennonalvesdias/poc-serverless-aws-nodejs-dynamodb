'use strict';

let AWS = require('aws-sdk');
import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function list(event: APIGatewayEvent, context: Context, callback): Promise<APIGatewayProxyResult> {
  try {
    const response = await listUsers();
    return response;
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't fetch the users.",
    };
  }
}

async function listUsers() {
  const params = {
    TableName: process.env.USERS_TABLE,
  };

  const { Items } = await dynamoDb.scan(params).promise();
  console.log(Items);

  if (Items) {
    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } else {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not find users',
    };
  }
}

export { listUsers };
