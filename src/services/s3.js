import aws from 'aws-sdk';

const signS3 = (req, res) => {
  const { type, filename } = req.query;

  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'us-east-2',
  });

  const key = `memes/${Date.now()}-${filename}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: 60,
    ContentType: type,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) { res.status(422).end(); }

    const returnData = {
      signedRequest: data,
      url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
    };
    return (res.send(JSON.stringify(returnData)));
  });
};

export default signS3;
