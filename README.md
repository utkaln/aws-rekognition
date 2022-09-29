# Use aws-rekognition to detect objects in an image

### Create S3 repository to upload raw images into


### Create Lambda function and add S3 object as the event trigger


### Attach following policies to Lambda to be able to invoke rekognition and let rekognition read S3 objects
1. AWSLambdaBasicExecutionRole
2. AmazonRekognitionFullAccess
3. AmazonS3ReadOnlyAccess

### Add lambda async code to invoke Rekognition


