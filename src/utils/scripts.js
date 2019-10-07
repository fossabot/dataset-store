import fs from 'fs';
import uuidv4 from 'uuid/v4';
import { PythonShell } from 'python-shell';

const createHeader = (headerPath, stream) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(headerPath, stream, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.mkdirSync('./headers');
          createHeader(headerPath, stream)
            .then((result) => {
              resolve(result);
            })
            .catch((err1) => {
              reject(err1);
            });
        } else {
          reject(err);
        }
      }

      resolve(true);
    });
  });
};

const inferDatatype = (path) => {
  const options = {
    mode: 'json',
    args: [path],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/infer.py', options, async (err, results) => {
      if (err) reject(err);

      const [columns] = results;
      const headerPath = `./headers/${uuidv4()}.txt`;

      let stream = '';

      columns.columns.forEach((c) => {
        stream = `${stream + c.datatype}\n`;
      });

      createHeader(headerPath, stream)
        .then(() => {
          resolve([columns, headerPath]);
        })
        .catch((errIO) => {
          reject(errIO);
        });
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

module.exports = {
  inferDatatype,
  getColumnNames,
  getTypesFromHeader,
};
