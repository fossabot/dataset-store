import minioClient from '../models/store';
import { Config } from '../config';

const getStream = async (objectPath) => {
  return new Promise((resolve, reject) => {
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
      const lines = result.split('\n');

      const fileLength = lines.length;

      const previewLines = lines.slice(0, Config.RESULT_LENGTH).map((r) => {
        return r.split(';');
      });

      const header = previewLines[0].map((e) => {
        const dataIndex = e
          .toLowerCase()
          .replace(/(\r\n\s|\n|\r|\s)/gm, '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return { title: e, dataIndex };
      });

      const rows = previewLines.slice(1).map((row, key) => {
        const rowObject = { key };
        header.forEach(({ dataIndex }, i) => {
          rowObject[dataIndex] = row[i];
        });
        return rowObject;
      });

      resolve([header, rows, fileLength]);
    });
  });
};

const getOriginalFileColumnsLength = async (stream) => {
  return new Promise((resolve) => {
    streamToString(stream).then((result) => {
      resolve(result.split('\n').length);
    });
  });
};

const getDatasetPreview = async (req, res) => {
  const { experimentId, headerId } = req.params;

  const datasetId = headerId;

  const objectPath = `${experimentId}/${datasetId}`;

  getStream(objectPath).then((stream) => {
    getTablePreview(stream).then(([header, rows, totalLines]) => {
      res.status(200).json({
        payload: {
          totalLines,
          header,
          rows,
        },
      });
    });
  });
};

const getResult = async (req, res) => {
  const { experimentId, task, headerId } = req.params;

  if (task === 'dataset') {
    getDatasetPreview(req, res);
  } else {
    const file = `${task}.csv`;

    const objectPath = `${experimentId}/${file}`;
    const originalObjectPath = `${experimentId}/${headerId}`;

    const countOriginalFile = getStream(originalObjectPath).then((stream) => {
      return getOriginalFileColumnsLength(stream);
    });

    const getResultPreview = getStream(objectPath).then((stream) => {
      return getTablePreview(stream);
    });

    Promise.all([countOriginalFile, getResultPreview])
      .then(([totalColumnsBefore, preview]) => {
        const [header, rows, totalLines] = preview;
        const totalColumnsAfter = header.length;

        const diff = totalColumnsAfter - totalColumnsBefore;
        const percentageDiff = parseInt((diff / totalColumnsBefore) * 100, 10);

        res.status(200).json({
          payload: {
            totalColumnsBefore,
            totalColumnsAfter,
            diff,
            percentageDiff,
            totalLines,
            header,
            rows,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.message === 'The specified key does not exist.') {
          res.status(400).json({ message: `Invalid object` }); // File doesn't exist
        } else {
          res.sendStatus(500); // Internal Server Error!
        }
      });
  }
};

const verifyIfObjectExists = (objectPath) => {
  return new Promise((resolve, reject) => {
    minioClient.statObject(Config.MINIO_BUCKET, objectPath, (err) => {
      if (err) {
        if (err.message === 'Not Found') {
          resolve(false);
        } else {
          reject(err);
        }
      } else {
        resolve(true);
      }
    });
  });
};

const verifyPlotType = async (experimentId) => {
  return new Promise((resolve, reject) => {
    const verifyIfConfusionMatrixExists = verifyIfObjectExists(
      `${experimentId}/confusion-matrix.png`
    );
    const verifyIfErrorDistributionExists = verifyIfObjectExists(
      `${experimentId}/error-distribution.png`
    );

    Promise.all([
      verifyIfConfusionMatrixExists,
      verifyIfErrorDistributionExists,
    ])
      .then(([resultConfusionMatrix, resultErrorDistribution]) => {
        if (resultConfusionMatrix) {
          resolve('confusion-matrix');
        }
        if (resultErrorDistribution) {
          resolve('error-distribution');
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const getPlot = async (req, res) => {
  const { experimentId } = req.params;

  verifyPlotType(experimentId).then((plotType) => {
    const objectPath = `${experimentId}/${plotType}.png`;

    getStream(objectPath)
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
  });
};

const getPlotType = async (req, res) => {
  const { experimentId } = req.params;

  verifyPlotType(experimentId)
    .then((type) => {
      res.status(200).json({ type });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getResult,
  getPlot,
  getPlotType,
};
