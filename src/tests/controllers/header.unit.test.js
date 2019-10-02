import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { PassThrough } from 'stream';

import { Header as Controller } from '../../controllers';
import { Header as Model } from '../../models';

describe('Test Header Controller methods', () => {
  const mockedHeader = new Model(
    '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
    'uploads',
    'data.csv'
  );

  const stubHeaderGetById = sinon.stub(Model, 'getById');
  const stubHeaderCreate = sinon.stub(Model, 'create');
  const stubHeaderDelete = sinon.stub(mockedHeader, 'delete');

  const stubDownloadHeader = sinon.stub(mockedHeader, 'downloadStream');
  const stubUploadHeader = sinon.stub(mockedHeader, 'uploadFile');

  const mockedStream = new PassThrough();

  describe('Test getById Header controller', () => {
    const headerGetByIdVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        methods: 'GET',
        url: '/headers/:uuid',
        params: {
          uuid: '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.downloadHeader(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves downloadHeader', () => {
      stubHeaderGetById.resolves(mockedHeader);
      stubDownloadHeader.resolves(mockedStream);

      headerGetByIdVerify(200);
    });

    it('Rejects downloadHeader', () => {
      stubHeaderGetById.resolves(mockedHeader);
      stubDownloadHeader.rejects('S3Error');
      stubHeaderDelete.resolves(true);

      headerGetByIdVerify(500);
    });

    it('Rejects getById model, invalid key', () => {
      stubHeaderGetById.rejects({
        message: 'The specified key does not exist.',
      });

      headerGetByIdVerify(400);
    });

    it('Rejects getById model, forced internal server error', () => {
      stubHeaderGetById.rejects('S3Error');

      headerGetByIdVerify(500);
    });
  });

  describe('Test create Header controller', () => {
    const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

    const headerGetByIdVerify = async (req, expectedCode) => {
      const res = httpMocks.createResponse();

      const result = await Controller.uploadHeader(req, res);
      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves uploadHeader', () => {
      stubHeaderCreate.resolves(mockedHeader);
      stubUploadHeader.resolves(mockedStream);

      const req = httpMocks.createRequest();

      req.file = file;

      headerGetByIdVerify(req, 200);
    });

    it('Rejects uploadHeader', () => {
      stubHeaderCreate.resolves(mockedHeader);
      stubUploadHeader.rejects('S3Error');

      const req = httpMocks.createRequest();

      req.file = file;

      headerGetByIdVerify(req, 500);
    });

    it('Rejects createHeader, forced internal server error', () => {
      stubHeaderCreate.rejects('S3Error');

      const req = httpMocks.createRequest();

      req.file = file;

      headerGetByIdVerify(req, 500);
    });

    it('Send empty request', () => {
      const req = httpMocks.createRequest();

      headerGetByIdVerify(req, 400);
    });
  });
});
