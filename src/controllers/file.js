import config from '../config/config';
import { File } from '../models';

const uploadFile = (req, res) => {
  if (req.file) {
    File.uploadFile(config.MINIO_BUCKET, req.file)
      .then(() => {
        res
          .status(200)
          .json({ message: 'File uploaded successfully', payload: req.file }); // Success!;
      })
      .catch(() => {
        res.sendStatus(500); // Internal Server Error!
      });
  } else {
    res.status(400).json({ message: 'Missing file.' }); // File missing!
  }
};

module.exports = {
  uploadFile,
};
