import config from '../config/config';
import { Bucket } from '../models';

const verifyBucket = (req, res, next) => {
  const bucketName = config.MINIO_BUCKET;

  Bucket.bucketExists(bucketName)
    .then((exists) => {
      if (exists) next();
      else {
        Bucket.createBucket(bucketName)
          .then((err) => {
            if (!err) next();
            else res.sendStatus(500);
          })
          .catch(() => {
            res.sendStatus(500);
          });
      }
    })
    .catch(() => {
      res.sendStatus(500);
    });
};

module.exports = {
  verifyBucket,
};
