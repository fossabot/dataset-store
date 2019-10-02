import uuidv4 from 'uuid/v4';

import { Column } from '../models';

const getAll = async (req, res) => {
  const { datasetId } = req.params;

  await Column.getAll(datasetId)
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
  const { uuid } = req.params;

  await Column.getById(uuid)
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
  const { uuid } = req.params;
  const { datatype } = req.body;

  await Column.getById(uuid)
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
  return res;
};

const create = async (req, res) => {
  const { datasetId } = req.params;
  const { name, datatype } = req.body;

  await Column.create(uuidv4(), name, datatype, datasetId)
    .then((result) => {
      res.status(200).json({ payload: result });
    })
    .catch(() => {
      res.sendStatus(500);
    });
  return res;
};

module.exports = {
  getAll,
  getById,
  update,
  create,
};
