import minioClient from './store';

const createBucketStore = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.makeBucket(bucketName, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

const bucketExistsStore = (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) reject(err);
      else resolve(exists);
    });
  });
};

module.exports = {
  createBucketStore,
  bucketExistsStore,
};
