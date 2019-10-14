import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { PassThrough } from 'stream';

import { Dataset as Controller } from '../../controllers';
import { Dataset as Model } from '../../models';

describe('Test Experiment Controller methods', () => {
  const stubDatasetGetById = sinon.stub(Model, 'getById');
  const stubDatasetCreate = sinon.stub(Model, 'create');

  const mockedDataset = new Model(
    '2864d96c-9171-43d1-9b89-af9828c30e61',
    'mlpipeline',
    'data.csv'
  );

  const stubUploadDataset = sinon.stub(mockedDataset, 'uploadFile');

  const mockedStream = new PassThrough();

  describe('Test getById Dataset controller', () => {
    const datasetGetByIdVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        methods: 'GET',
        url: '/dataset/:uuid',
        params: {
          uuid: '2864d96c-9171-43d1-9b89-af9828c30e61',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.getById(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves downloadDatase', () => {
      stubDatasetGetById.resolves(mockedDataset);

      datasetGetByIdVerify(200);
    });

    it('Rejects getById model, invalid key', () => {
      stubDatasetGetById.rejects({
        message: 'The specified key does not exist.',
      });

      datasetGetByIdVerify(400);
    });

    it('Rejects getById model, forced internal server error', () => {
      stubDatasetGetById.rejects('S3Error');

      datasetGetByIdVerify(500);
    });
  });

  describe('Test upload Dataset controller', () => {
    const file = [
      {
        originalname: 'test',
        path: 'data/test.txt',
      },
    ];

    const datasetUploadVerify = async () => {
      Controller.uploadDataset(file)
        .then((dataset) => {
          expect(dataset).toStrictEqual(mockedDataset);
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced Error'));
        });
    };

    it('Resolves uploadDataset', () => {
      stubDatasetCreate.resolves(mockedDataset);
      stubUploadDataset.resolves(mockedStream);

      datasetUploadVerify();
    });

    it('Rejects createDataset, forced internal server error', () => {
      stubDatasetCreate.rejects(Error('Forced Error'));

      datasetUploadVerify();
    });

    it('Rejects uploadFile, forced internal server error', () => {
      stubDatasetCreate.resolves(mockedDataset);
      stubUploadDataset.rejects(Error('Forced Error'));

      datasetUploadVerify();
    });
  });
});
