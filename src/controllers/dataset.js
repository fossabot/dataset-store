import uuidv4 from 'uuid/v4';
import config from '../config/config';
import { Dataset } from '../models';

const downloadDataset = async (req, res) => {
  const { datasetId } = req.params;
  await Dataset.getById(datasetId)
    .then((dataset) => {
      dataset
        .downloadStream()
        .then((stream) => {
          stream.pipe(res);
        })
        .catch(() => {
          res.sendStatus(500);
        });
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
  const { file } = req;
  if (file) {
    const uuid = uuidv4();
    await Dataset.create(uuid, config.MINIO_BUCKET, file)
      .then((dataset) => {
        dataset
          .uploadFile(file)
          .then(() => {
            res.status(200).json({
              message: 'File uploaded successfully',
              payload: dataset,
            }); // Success!
          })
          .catch(() => {
            res.sendStatus(500); // Internal Server Error!
          });
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
