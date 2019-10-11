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

const getResult = async (req, res) => {
  const { experimentId } = req.params;
  const { task } = req.body;

  const file = `${task}.csv`;

  getStream(experimentId, file).then((stream) => {
    streamToString(stream).then((result) => {
      const lines = result
        .split('\n')
        .slice(0, Config.RESULT_LENGTH)
        .map((r) => {
          return r.split(';');
        });

      const header = lines[0];
      const rows = lines.slice(1);

      res.status(200).json({ payload: { header, rows } });
    });
  });
};

const getConfusionMatrix = async (req, res) => {
  const { experimentId } = req.params;
  const file = 'plot.png';

  getStream(experimentId, file).then((stream) => {
    stream.pipe(res);
  });
};

module.exports = {
  getResult,
  getConfusionMatrix,
};
