import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { PassThrough } from 'stream';
import { Dataset } from '../../controllers';
import { Dataset as DatasetModel } from '../../models';

describe('Test DownloadDataset controller.', () => {
  const checkResult = async (expectedStatusCode) => {
    const res = httpMocks.createResponse();
    const req = httpMocks.createRequest();

    req.params.datasetName = 'test.csv';

    const result = await Dataset.downloadDataset(req, res);
    expect(result.statusCode).toBe(expectedStatusCode);
  };

  const stubDownloadDataset = sinon.stub(DatasetModel, 'downloadDatasetStore');

  it('Testing dataset download succesfully.', () => {
    const mockedStream = new PassThrough();

    stubDownloadDataset.resolves(mockedStream);

    checkResult(200);
  });

  it('Testing error on dataset download.', () => {
    stubDownloadDataset.rejects('S3Error');

    checkResult(500);
  });

  it('Testing send a invalid filename.', () => {
    stubDownloadDataset.rejects({
      message: 'The specified key does not exist.',
    });

    checkResult(400);
  });
});

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
