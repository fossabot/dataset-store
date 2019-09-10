import sinon from 'sinon';
import { Store, Dataset } from '../../models';

describe('Test Dataset management functions.', () => {
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
