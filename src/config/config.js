import 'dotenv/config';

module.exports = {
  PORT: process.env.HOST_PORT || 3000,
  MINIO_HOST: process.env.MINIO_HOST || 'minio',
  MINIO_PORT: parseInt(process.env.MINIO_PORT, 10) || 9000,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'secret',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'super-secret',
};
