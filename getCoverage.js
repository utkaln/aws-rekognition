// code reference from AWS Docs
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.queryStringParameters.uid;
  console.log(`Fetching data from user -> ${userId}`);
  var body = {};
  var statusCode = 400;
  var qParams = {
    TableName: "trvpi-property-catalog",
    KeyConditionExpression: "pk = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  };

  try {
    var queryData = await docClient.query(qParams).promise();
    console.log(queryData);
    statusCode = 200;
    body = JSON.stringify(queryData);
  } catch (error) {
    body = error.message;
    statusCode = 400;
  } finally {
    var response = {
      statusCode: statusCode,
      body: body,
    };
  }
  return response;
};
