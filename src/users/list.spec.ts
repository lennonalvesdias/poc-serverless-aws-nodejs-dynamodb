// import { APIGatewayEvent, Context } from 'aws-lambda';
// import * as handler from './list';

// process.env.USERS_TABLE = 'users-table-dev';

// function callback() {}

// test('hello', async () => {
//   const event = { body: 'Test Body' } as APIGatewayEvent;
//   const context = {} as Context;

//   const response = await handler.list(event, context, callback);

//   expect(response.statusCode).toEqual(501);
// });

let AWSMock = require('aws-sdk-mock');
let AWS = require('aws-sdk');
import { GetItemInput } from 'aws-sdk/clients/dynamodb';


describe('the module', () => {
  /**
    TESTS below here
**/

  it('should mock getItem from DynamoDB', async () => {
    // Overwriting DynamoDB.getItem()
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB', 'getItem', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB', 'getItem', 'mock called');
      callback(null, { pk: 'foo', sk: 'bar' });
    });

    const input: GetItemInput = { TableName: '', Key: {} };
    const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    expect(await dynamodb.getItem(input).promise()).toStrictEqual({ pk: 'foo', sk: 'bar' });

    AWSMock.restore('DynamoDB');
  });

  it('should mock reading from DocumentClient', async () => {
    // Overwriting DynamoDB.DocumentClient.get()
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      console.log('DynamoDB.DocumentClient', 'get', 'mock called');
      callback(null, { pk: 'foo', sk: 'bar' });
    });

    const input: GetItemInput = { TableName: '', Key: {} };
    const client = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    expect(await client.get(input).promise()).toStrictEqual({ pk: 'foo', sk: 'bar' });

    AWSMock.restore('DynamoDB.DocumentClient');
  });
});
