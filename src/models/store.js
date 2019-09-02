import config from '../config/config';

const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: config.MINIO_HOST,
  port: config.MINIO_PORT,
  useSSL: false,
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
});

module.exports = {
  minioClient,
};
