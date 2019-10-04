import { PythonShell } from 'python-shell';

const inferDatatype = (path) => {
  const options = {
    mode: 'json',
    args: [path],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/infer.py', options, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const getColumnNames = (path) => {
  const options = {
    args: [path],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('scripts/get_columns.py', options, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

module.exports = {
  inferDatatype,
  getColumnNames,
};
