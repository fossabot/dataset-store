import uuidv4 from 'uuid/v4';

import config from '../config/config';
import Header from './header';
import { Dataset } from '../models';
import Scripts from '../utils';

const downloadDataset = async (req, res) => {
  const { uuid } = req.params;
  await Dataset.getById(uuid)
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

const uploadDataset = async ([file]) => {
  return new Promise((resolve, reject) => {
    const uuid = uuidv4();
    Dataset.create(uuid, config.MINIO_BUCKET, file)
      .then((dataset) => {
        dataset
          .uploadFile(file)
          .then(() => {
            resolve(dataset);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const handleDatasetHeader = async (req, res) => {
  const { dataset, header } = req.files;

  if (dataset) {
    if (header) {
      const upDataset = uploadDataset(dataset);
      const upHeader = Header.uploadHeader(header);

      Promise.all([upDataset, upHeader])
        .then((datasetResult, headerResult) => {
          res.status(200).json({
            message: 'Files uploaded successfully',
            payload: { dataset: datasetResult, header: headerResult },
          }); // Success!
        })
        .catch(() => {
          res.sendStatus(500); // Internal Server Error!
        });
    } else {
      Scripts.inferDatatype(dataset[0].path).then(([columns]) => {
        res.send({ a: columns });
      });
    }
  } else {
    res.status(400).json({ message: 'Dataset missing.' }); // File missing!
  }
  return res;
};

module.exports = {
  downloadDataset,
  handleDatasetHeader,
};
