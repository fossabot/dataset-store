import minioClient from './store';

const createBucket = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.makeBucket(bucketName, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const bucketExists = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) reject(err);
      resolve(exists);
    });
  });
};

module.exports = {
  createBucket,
  bucketExists,
};
