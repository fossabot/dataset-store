import config from '../config/config';
import { Bucket } from '../models';

const verifyBucket = async (req, res, next) => {
  const bucketName = config.MINIO_BUCKET;
  await Bucket.bucketExists(bucketName)
    .then((exists) => {
      if (exists) {
        next();
      } else
        Bucket.createBucket(bucketName)
          .then(() => {
            next();
          })
          .catch(() => {
            res.sendStatus(500);
          });
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

module.exports = {
  verifyBucket,
};
