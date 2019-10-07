import uuidv4 from 'uuid/v4';
import config from '../config/config';
import { Header } from '../models';

const downloadHeader = async (req, res) => {
  const { uuid } = req.params;
  await Header.getById(uuid)
    .then((header) => {
      header
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

const uploadHeader = async ([file]) => {
  return new Promise((resolve, reject) => {
    const uuid = uuidv4();
    Header.create(uuid, config.MINIO_BUCKET, file)
      .then((header) => {
        header
          .uploadFile(file)
          .then(() => {
            resolve(header);
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

module.exports = {
  downloadHeader,
  uploadHeader,
};
