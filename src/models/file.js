import minioClient from './store';

const uploadFileStore = (bucketName, file) => {
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
  uploadFileStore,
};
