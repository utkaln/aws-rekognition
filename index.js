// code reference from AWS Docs
const AWS = require("aws-sdk");
const rekog = new AWS.Rekognition();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Object detected in trvpiij22");
  const imgData = await processImage(event);
  console.log(JSON.stringify(imgData));
  const batchParams = await processDDB(imgData);
  console.log(JSON.stringify(batchParams));
  docClient.batchWrite(batchParams, (err, data) => {
    if (err) {
      console.log(
        "Error occurred from method Batch Write()-> ",
        err.code,
        err.message
      );
    } else {
      console.log("Returned data from method Batch Write() -> ", data);
    }
  });

  //return ddbUpdate;
};

//Detect Objects from S3 bucket
const processImage = async function (event) {
  const bucket = "trvpiij22";
  const photo = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  console.log(`Detected bucket -> ${bucket} , photo: ${photo}`);
  try {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: photo,
        },
      },
      MaxLabels: 20,
      MinConfidence: 75,
    };

    let data = await rekog.detectLabels(params).promise();

    data.Labels.forEach((label) => {
      console.log(`Label:      ${label.Name}`);
      console.log(`Confidence: ${label.Confidence}`);
      console.log("Instances:");
      label.Instances.forEach((instance) => {
        let box = instance.BoundingBox;
        console.log("  Bounding box:");
        console.log(`    Top:        ${box.Top}`);
        console.log(`    Left:       ${box.Left}`);
        console.log(`    Width:      ${box.Width}`);
        console.log(`    Height:     ${box.Height}`);
        console.log(`  Confidence: ${instance.Confidence}`);
      });
      console.log("Parents:");
      label.Parents.forEach((parent) => {
        console.log(`  ${parent.Name}`);
      });
      console.log("------------");
      console.log("Rekognition Analysis Complete !");
    }); // for response.labels
    return data;
  } catch (error) {
    console.log(error);
  }
};

const processDDB = async function (data) {
  const ddbArr = [];
  data.Labels.forEach((label) => {
    ddbArr.push({
      PutRequest: {
        Item: {
          // TODO - hardcoded user id
          pk: "utkalnayak",
          sk: label.Name,
          confidence: label.Confidence,
        },
      },
    });
  });

  // build request param for batch write
  var batchParams = {
    RequestItems: {
      "trvpi-property-catalog": ddbArr,
    },
  };
  return batchParams;
};
