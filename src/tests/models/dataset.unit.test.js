import sinon from 'sinon';
import { Store, Dataset } from '../../models';

describe('Test Dataset management functions.', () => {
  const downloadDataset = () => {
    Dataset.downloadDatasetStore('testing', 'teste')
      .then((result) => {
        expect(result).toBe('a');
      })
      .catch((err) => {
        expect(err).toBe('S3Error');
      });
  };

  describe('Test Dataset download function.', () => {
    const stubDatasetDownload = sinon.stub(Store, 'getObject');

    it('Resolve dataset upload promise.', () => {
      stubDatasetDownload.yields(null, 'a');

      downloadDataset();
    });

    it('Force internal server error', () => {
      stubDatasetDownload.yields('S3Error');

      downloadDataset();
    });
  });

  const uploadDataset = (file) => {
    Dataset.uploadDatasetStore('testing', file)
      .then((result) => {
        expect(result).toBeTruthy();
      })
      .catch((err) => {
        expect(err).toBe('S3Error');
      });
  };

  describe('Test Dataset upload function.', () => {
    const stubDatasetUpload = sinon.stub(Store, 'fPutObject');

    it('Resolve dataset upload promise.', () => {
      stubDatasetUpload.yields(null);
      const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

      uploadDataset(file);
    });

    it('Force internal server error', () => {
      stubDatasetUpload.yields('S3Error');
      const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

      uploadDataset(file);
    });
  });
});
