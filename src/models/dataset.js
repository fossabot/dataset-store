import minioClient from './store';

const downloadDatasetStore = (bucketName, filename) => {
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucketName, filename, (err, stream) => {
      if (err) reject(err);
      resolve(stream);
    });
  });
};

const uploadDatasetStore = (bucketName, file) => {
  return new Promise((resolve, reject) => {
    minioClient.fPutObject(
      bucketName,
      file.originalname,
      file.path,
      {
        'Content-Type': 'application/octet-stream',
      },
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
};

module.exports = {
  downloadDatasetStore,
  uploadDatasetStore,
};
