import uuidv4 from 'uuid/v4';

import config from '../config/config';
import Header from './header';
import { Dataset, Column } from '../models';
import { Scripts } from '../utils';

const getById = async (req, res) => {
  const { datasetId } = req.params;
  await Dataset.getById(datasetId)
    .then((dataset) => {
      res.status(200).json({ payload: dataset });
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

const uploadDataset = async ([file], experimentId) => {
  return new Promise((resolve, reject) => {
    const uuid = uuidv4();
    Dataset.create(uuid, config.MINIO_BUCKET, file, experimentId)
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
  const { experimentId } = req.body;
  const { dataset, header } = req.files;

  if (dataset) {
    if (header) {
      const upDataset = uploadDataset(dataset, experimentId);
      const upHeader = Header.uploadHeader(header, experimentId);

      Promise.all([upDataset, upHeader])
        .then((result) => {
          const getColumns = Scripts.getColumnNames(dataset[0].path);
          const getTypes = Scripts.getTypesFromHeader(header[0].path);

          Promise.all([getColumns, getTypes]).then(([[columns], [types]]) => {
            const createColumns = columns.map((column, index) => {
              return Column.create(
                uuidv4(),
                column.name,
                types[index].datatype,
                index,
                result[1].uuid
              );
            });

            Promise.all(createColumns)
              .then(() => {
                res.status(200).json({
                  message: 'Files uploaded successfully',
                  payload: { dataset: result[0], header: result[1] },
                }); // Success!
              })
              .catch((err) => {
                console.log(err);
                if (err.message === 'Invalid datatype.') {
                  res.status(400).json({ message: 'Invalid datatype.' });
                } else {
                  res.sendStatus(500); // Internal Server Error!
                }
              });
          });
        })
        .catch(() => {
          res.sendStatus(500); // Internal Server Error!
        });
    } else {
      Scripts.inferDatatype(dataset[0].path).then(([columns, headerPath]) => {
        const upDataset = uploadDataset(dataset, experimentId);
        const upHeader = Header.uploadHeader(
          [{ originalname: 'inferedHeader', path: headerPath }],
          experimentId
        );

        Promise.all([upDataset, upHeader])
          .then((result) => {
            const createColumns = columns.columns.map((c, position) => {
              return Column.create(
                uuidv4(),
                c.name,
                c.datatype,
                position,
                result[1].uuid
              );
            });

            Promise.all(createColumns)
              .then(() => {
                res.status(200).json({
                  message: 'Files uploaded successfully',
                  payload: { dataset: result[0], header: result[1] },
                });
              })
              .catch((err) => {
                console.log(err);
                if (err.message === 'Invalid datatype.') {
                  res.status(400).json({ message: 'Invalid datatype.' });
                } else {
                  res.sendStatus(500); // Internal Server Error!
                }
              });
          })
          .catch(() => {
            res.sendStatus(500); // Internal Server Error!
          });
      });
    }
  } else {
    res.status(400).json({ message: 'Dataset missing.' }); // File missing!
  }
  return res;
};

module.exports = {
  getById,
  handleDatasetHeader,
  uploadDataset,
};
