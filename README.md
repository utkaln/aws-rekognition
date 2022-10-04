# Use aws-rekognition to detect objects in an image

### Create S3 repository to upload raw images into


### Create Lambda function and add S3 object as the event trigger


### Attach following policies to Lambda to be able to invoke rekognition and let rekognition read S3 objects
1. AWSLambdaBasicExecutionRole
2. AmazonRekognitionFullAccess
3. AmazonS3ReadOnlyAccess

### Add lambda async code to invoke Rekognition
- `createCoverage.js` is the Lambda function that processes the image and creates automatic coverage
- `getCoverage.js` is the Lambda function that shows the list of customer coverages

### Use Postman to view list of coverages
- Rest Endpoint - https://0omtufo9w5.execute-api.us-east-1.amazonaws.com/dev/coverage?uid=utkalnayak
- Get a `ID Token` from the Cognito UI
- Choose Authentication type as `OAuth2`. Add Header Prefix in Postman as `Bearer`


