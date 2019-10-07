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

      const result = await Controller.getById(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves downloadHeader', () => {
      stubHeaderGetById.resolves(mockedHeader);

      headerGetByIdVerify(200);
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

  describe('Test upload Header controller', () => {
    const file = [
      {
        originalname: 'test',
        path: 'data/test.txt',
      },
    ];

    const headerUploadVerify = async () => {
      Controller.uploadHeader(file)
        .then((header) => {
          expect(header).toStrictEqual(mockedHeader);
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced Error'));
        });
    };

    it('Resolves uploadHeader', () => {
      stubHeaderCreate.resolves(mockedHeader);
      stubUploadHeader.resolves(mockedStream);

      headerUploadVerify();
    });

    it('Rejects createHeader, forced internal server error', () => {
      stubHeaderCreate.rejects(Error('Forced Error'));

      headerUploadVerify();
    });

    it('Rejects uploadFile, forced internal server error', () => {
      stubHeaderCreate.resolves(mockedHeader);
      stubUploadHeader.rejects(Error('Forced Error'));

      headerUploadVerify();
    });
  });
});
