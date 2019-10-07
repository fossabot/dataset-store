import fs from 'fs';

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

module.exports = {
  createHeader,
};
