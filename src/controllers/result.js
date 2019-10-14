import minioClient from '../models/store';
import { Config } from '../config';

const getStream = async (experimentId, file) => {
  return new Promise((resolve, reject) => {
    const objectPath = `${experimentId}/${file}`;

    minioClient.getObject('mlpipeline', objectPath, (err, stream) => {
      if (err) reject(err);
      resolve(stream);
    });
  });
};

const streamToString = async (stream) => {
  return new Promise((resolve) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
};

const getTablePreview = async (stream) => {
  return new Promise((resolve) => {
    streamToString(stream).then((result) => {
      const lines = result
        .split('\n')
        .slice(0, Config.RESULT_LENGTH)
        .map((r) => {
          return r.split(';');
        });

      const header = lines[0].map((e) => {
        const dataIndex = e
          .toLowerCase()
          .replace(/(\r\n\s|\n|\r|\s)/gm, '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return { title: e, dataIndex };
      });

      const rows = lines.slice(1).map((row, key) => {
        const rowObject = { key };
        header.forEach(({ dataIndex }, i) => {
          rowObject[dataIndex] = row[i];
        });
        return rowObject;
      });

      resolve([header, rows]);
    });
  });
};

const getResult = async (req, res) => {
  const { experimentId } = req.params;
  const { task } = req.body;

  const file = `${task}.csv`;

  getStream(experimentId, file)
    .then((stream) => {
      getTablePreview(stream).then(([header, rows]) => {
        res.status(200).json({
          payload: { totalColumnsAfter: header.length, header, rows },
        });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'The specified key does not exist.') {
        res.status(400).json({ message: `Invalid experimentId` }); // File doesn't exist
      } else {
        res.sendStatus(500); // Internal Server Error!
      }
    });
};

const getConfusionMatrix = async (req, res) => {
  const { experimentId } = req.params;
  const file = 'plot.png';

  getStream(experimentId, file)
    .then((stream) => {
      stream.pipe(res);
    })
    .catch((err) => {
      console.error(err);
      if (err.message === 'The specified key does not exist.') {
        res.status(400).json({ message: `Invalid experimentId` }); // File doesn't exist
      } else {
        res.sendStatus(500); // Internal Server Error!
      }
    });
};

module.exports = {
  getResult,
  getConfusionMatrix,
};
