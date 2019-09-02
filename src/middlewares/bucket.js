import config from '../config/config';
import { store } from '../models';

function createBucket() {
  store.minioClient.makeBucket(config.MINIO_BUCKET, (err) => {
    if (err) {
      return console.log(err);
    }

    return console.log('Bucket created succesfully!');
  });
}

function bucketVerify() {
  store.minioClient.bucketExists(config.MINIO_BUCKET, (err, exists) => {
    if (err) {
      return console.log(err);
    }

    if (!exists) {
      console.log(`Bucket doesn't exists!`);
      return createBucket();
    }

    return console.log('Bucket already exists!');
  });
}

export default bucketVerify;
