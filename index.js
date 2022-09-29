// code reference from AWS Docs
const AWS = require("aws-sdk");
const rekog = new AWS.Rekognition();

exports.handler = async (event) => {
  console.log("Object detected in trvpiij22");
  return await processImage(event);
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
  } catch (error) {
    console.log(error);
  }
};
