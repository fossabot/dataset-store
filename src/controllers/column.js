import uuidv4 from 'uuid/v4';

import config from '../config/config';
import { Column } from '../models';

const validateDatatype = async (datatype) => {
  return new Promise((resolve, reject) => {
    if (config.VALID_DATATYPES.includes(datatype)) {
      resolve();
    }
    reject();
  });
};

const getAll = async (req, res) => {
  const { headerId } = req.params;

  await Column.getAll(headerId)
    .then((columns) => {
      res.status(200).json({ payload: columns });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  return res;
};

const getById = async (req, res) => {
  const { columnId } = req.params;

  await Column.getById(columnId)
    .then((column) => {
      res.status(200).json({ payload: column });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'Invalid UUID.') {
        res.status(400).json({ message: `Column UUID doesn't exists.` });
      } else {
        res.sendStatus(500);
      }
    });

  return res;
};

const update = async (req, res) => {
  const { columnId } = req.params;
  const { datatype } = req.body;

  await validateDatatype(datatype)
    .then(async () => {
      await Column.getById(columnId)
        .then((column) => {
          column
            .update(datatype)
            .then((updated) => {
              res
                .status(200)
                .json({ message: 'Updated successfully.', payload: updated });
            })
            .catch((err) => {
              console.error(err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          console.error(err);
          if (err.message === 'Invalid UUID.') {
            res.status(400).json({ message: `Column UUID doesn't exists.` });
          } else {
            res.sendStatus(500);
          }
        });
    })
    .catch(() => {
      res.status(400).json({ message: 'Invalid datatype.' });
    });
  return res;
};

const create = async (req, res) => {
  const { headerId } = req.params;
  const { name, datatype } = req.body;

  await validateDatatype(datatype)
    .then(async () => {
      await Column.create(uuidv4(), name, datatype, headerId)
        .then((result) => {
          res.status(200).json({ payload: result });
        })
        .catch(() => {
          res.sendStatus(500);
        });
    })
    .catch(() => {
      res.status(400).json({ message: 'Invalid datatype.' });
    });
  return res;
};

module.exports = {
  getAll,
  getById,
  update,
  create,
};
