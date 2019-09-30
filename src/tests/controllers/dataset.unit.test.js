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
    'uploads',
    'data.csv'
  );

  const stubDownloadDataset = sinon.stub(mockedDataset, 'downloadStream');
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

      const result = await Controller.downloadDataset(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves downloadDatase', () => {
      stubDatasetGetById.resolves(mockedDataset);
      stubDownloadDataset.resolves(mockedStream);

      datasetGetByIdVerify(200);
    });

    it('Rejects downloadDatase', () => {
      stubDatasetGetById.resolves(mockedDataset);
      stubDownloadDataset.rejects('S3Error');

      datasetGetByIdVerify(500);
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

  describe('Test create Dataset controller', () => {
    const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

    const datasetGetByIdVerify = async (req, expectedCode) => {
      const res = httpMocks.createResponse();

      const result = await Controller.uploadDataset(req, res);
      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves uploadDataset', () => {
      stubDatasetCreate.resolves(mockedDataset);
      stubUploadDataset.resolves(mockedStream);

      const req = httpMocks.createRequest();

      req.file = file;

      datasetGetByIdVerify(req, 200);
    });

    it('Rejects uploadDataset', () => {
      stubDatasetCreate.resolves(mockedDataset);
      stubUploadDataset.rejects('S3Error');

      const req = httpMocks.createRequest();

      req.file = file;

      datasetGetByIdVerify(req, 500);
    });

    it('Rejects createDataset, forced internal server error', () => {
      stubDatasetCreate.rejects('S3Error');

      const req = httpMocks.createRequest();

      req.file = file;

      datasetGetByIdVerify(req, 500);
    });

    it('Send empty request', () => {
      const req = httpMocks.createRequest();

      datasetGetByIdVerify(req, 400);
    });
  });
});
