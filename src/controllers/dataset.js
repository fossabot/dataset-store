import config from '../config/config';
import { Dataset } from '../models';

const downloadDataset = async (req, res) => {
  await Dataset.downloadDatasetStore(
    config.MINIO_BUCKET,
    req.params.datasetName
  )
    .then((stream) => {
      stream.pipe(res);
    })
    .catch((err) => {
      if (err.message === 'The specified key does not exist.') {
        res
          .status(400)
          .json({ message: `Requested file doesn't exist on datastorage.` }); // File doesn't exist
      } else {
        res.sendStatus(500); // Internal Server Error!
      }
    });
  return res;
};

const uploadDataset = async (req, res) => {
  if (req.file) {
    await Dataset.uploadDatasetStore(config.MINIO_BUCKET, req.file)
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
  downloadDataset,
  uploadDataset,
};
