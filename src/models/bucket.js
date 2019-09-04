import minioClient from './store';

const createBucket = (bucketName, fn) => {
  minioClient.makeBucket(bucketName, (err) => {
    if (err) {
      console.log(err);
      return fn(false, err.message);
    }

    return fn(true);
  });
};

const bucketExists = (bucketName, fn) => {
  minioClient.bucketExists(bucketName, (err, exists) => {
    if (err) {
      console.log(err);
      return fn(false, err.message);
    }

    return fn(exists);
  });
};

module.exports = {
  createBucket,
  bucketExists,
};
