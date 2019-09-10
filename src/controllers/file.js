import config from '../config/config';
import { File } from '../models';

const uploadFile = async (req, res) => {
  if (req.file) {
    await File.uploadFileStore(config.MINIO_BUCKET, req.file)
      .then(() => {
        res
          .status(200)
          .json({ message: 'File uploaded successfully', payload: req.file }); // Success!;
      })
      .catch(() => {
        res.sendStatus(500); // Internal Server Error!
      });
  } else {
    await res.status(400).json({ message: 'Missing file.' }); // File missing!
  }
  return res;
};

module.exports = {
  uploadFile,
};
