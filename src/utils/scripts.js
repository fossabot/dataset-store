import uuidv4 from 'uuid/v4';
import { PythonShell } from 'python-shell';
import createHeader from './createHeader';

const inferDatatype = (path) => {
  const options = {
    mode: 'json',
    args: [path],
  };

  return new Promise((resolve, reject) => {
    new Promise((_resolve, _reject) => {
      PythonShell.run('scripts/infer.py', options, async (err, results) => {
        if (err) _reject(err);
        _resolve(results);
      });
    })
      .then((results) => {
        const [columns] = results;
        const headerPath = `./headers/${uuidv4()}.txt`;

        let stream = '';

        columns.columns.forEach((c) => {
          stream = `${stream + c.datatype}\n`;
        });

        createHeader
          .createHeader(headerPath, stream)
          .then(() => {
            resolve([columns, headerPath]);
          })
          .catch((errIO) => {
            reject(errIO);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getColumnNames = (path) => {
  const options = {
    mode: 'json',
    args: [path],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/get_columns.py', options, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const getTypesFromHeader = (path) => {
  const options = {
    mode: 'json',
    args: [path],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/get_types.py', options, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const updateHeader = (path, position, newDatatype) => {
  const options = {
    args: [path, position, newDatatype],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/update_header.py', options, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  inferDatatype,
  getColumnNames,
  getTypesFromHeader,
  updateHeader,
};
