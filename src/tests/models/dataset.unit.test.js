import sinon from 'sinon';
import { Knex } from '../../config';

import { Store, Dataset } from '../../models';

describe('Test Dataset Model methods', () => {
  const stubKnexSelect = sinon.stub(Knex, 'select');
  const stubKnexInsert = sinon.stub(Knex, 'insert');

  const stubDatasetDownload = sinon.stub(Store, 'getObject');
  const stubDatasetUpload = sinon.stub(Store, 'fPutObject');

  const mockedDataset = new Dataset(
    '2864d96c-9171-43d1-9b89-af9828c30e61',
    'mlpipeline',
    'data.csv'
  );

  describe('Test getById Project method', () => {
    const datasetGetIdVerify = (expectedError) => {
      Dataset.getById('2864d96c-9171-43d1-9b89-af9828c30e61')
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: '2864d96c-9171-43d1-9b89-af9828c30e61',
            bucketName: 'mlpipeline',
            originalName: 'data.csv',
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error(expectedError));
        });
    };

    it('Resolves db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().resolves({
          uuid: '2864d96c-9171-43d1-9b89-af9828c30e61',
          bucketName: 'mlpipeline',
          originalName: 'data.csv',
        }),
      });

      datasetGetIdVerify(null);
    });

    it('Resolves db query for invalid uuid', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().resolves(undefined),
      });

      datasetGetIdVerify('Invalid UUID.');
    });

    it('Rejects db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().rejects(Error('Forced error.')),
      });

      datasetGetIdVerify('Forced error.');
    });
  });

  describe('Test create Dataset method', () => {
    const datasetCreateVerify = () => {
      Dataset.create('2864d96c-9171-43d1-9b89-af9828c30e61', 'mlpipeline', {
        originalname: 'data.csv',
      })
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: '2864d96c-9171-43d1-9b89-af9828c30e61',
            bucketName: 'mlpipeline',
            originalName: 'data.csv',
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced error'));
        });
    };

    it('Resolves db query', () => {
      stubKnexInsert.callsFake(() => {
        return {
          into: sinon.stub().resolves([0]),
        };
      });

      datasetCreateVerify();
    });

    it('Rejects db query', () => {
      stubKnexInsert.callsFake(() => {
        return {
          into: sinon.stub().rejects(Error('Forced error')),
        };
      });

      datasetCreateVerify();
    });
  });

  describe('Test downloadStream method', () => {
    const datasetDownloadFileVerify = () => {
      mockedDataset
        .downloadStream()
        .then((result) => {
          expect(result).toBe('Success');
        })
        .catch((err) => {
          expect(err).toBe('S3Error');
        });
    };

    it('Resolve dataset upload promise.', () => {
      stubDatasetDownload.yields(null, 'Success');

      datasetDownloadFileVerify();
    });

    it('Force internal server error', () => {
      stubDatasetDownload.yields('S3Error');

      datasetDownloadFileVerify();
    });
  });

  describe('Test uploadFile method', () => {
    const datasetUploadFileVerify = (file) => {
      mockedDataset
        .uploadFile(file)
        .then((result) => {
          expect(result).toBeTruthy();
        })
        .catch((err) => {
          expect(err).toBe('S3Error');
        });
    };

    it('Resolve dataset upload promise.', () => {
      stubDatasetUpload.yields(null);
      const file = { originalname: 'data.csv', path: '../testFiles/data.csv' };

      datasetUploadFileVerify(file);
    });

    it('Force internal server error', () => {
      stubDatasetUpload.yields('S3Error');
      const file = { originalname: 'data.csv', path: '../testFiles/data.csv' };

      datasetUploadFileVerify(file);
    });
  });
});
