import 'dotenv/config';

module.exports = {
  PORT: process.env.HOST_PORT || 4000,
  MINIO_HOST: process.env.MINIO_HOST || 'minio-service',
  MINIO_PORT: parseInt(process.env.MINIO_PORT, 10) || 9000,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minio',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minio123',
  MINIO_BUCKET: process.env.MINIO_BUCKET || 'mlpipeline',
  MINIO_UPLOAD_FOLDER_NAME: process.env.MINIO_UPLOAD_FOLDER_NAME || 'uploads',
  VALID_DATATYPES: process.env.VALID_DATATYPES
    ? process.env.VALID_DATATYPES.split(',')
    : ['numeric', 'factor', 'datetime'],
  RESULT_LENGTH: process.env.RESULT_LENGTH
    ? parseInt(process.env.RESULT_LENGTH, 10)
    : 11,
};
