import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { Dataset } from '../../controllers';
import { Dataset as DatasetModel } from '../../models';

describe('Test UploadDataset controller.', () => {
  const checkResult = async (req, expectedStatusCode) => {
    const res = httpMocks.createResponse();

    const result = await Dataset.uploadDataset(req, res);
    expect(result.statusCode).toBe(expectedStatusCode);
  };

  const stubUploadDataset = sinon.stub(DatasetModel, 'uploadDatasetStore');

  const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

  it('Testing dataset upload succesfully.', () => {
    stubUploadDataset.resolves(true);

    const req = httpMocks.createRequest();

    req.file = file;

    checkResult(req, 200);
  });

  it('Testing error on dataset upload.', () => {
    stubUploadDataset.rejects('S3Error');

    const req = httpMocks.createRequest();

    req.file = file;

    checkResult(req, 500);
  });

  it('Sending empty request.', () => {
    const req = httpMocks.createRequest();

    checkResult(req, 400);
  });
});
