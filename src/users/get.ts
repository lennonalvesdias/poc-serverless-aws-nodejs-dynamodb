'use strict';

let AWS = require('aws-sdk');

if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1'
  });
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    const response = await getUser(id);
    callback(null, response);
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't fetch the user.",
    });
  }
};

async function getUser(id: string) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: id,
    },
  };

  const { Item } = await dynamoDb.get(params).promise();

  if (Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };
  } else {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not find user with provided "id"',
    };
  }
}

export { getUser };
