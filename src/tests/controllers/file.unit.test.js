import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { File } from '../../controllers';
import { File as FileModel } from '../../models';

describe('Test UploadFile controller.', () => {
  const checkResult = async (req, expectedStatusCode) => {
    const res = httpMocks.createResponse();

    const result = await File.uploadFile(req, res);
    expect(result.statusCode).toBe(expectedStatusCode);
  };

  const stubUploadFile = sinon.stub(FileModel, 'uploadFileStore');

  const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

  it('Testing file upload succesfully.', () => {
    stubUploadFile.resolves(true);

    const req = httpMocks.createRequest();

    req.file = file;

    checkResult(req, 200);
  });

  it('Testing error on file upload.', () => {
    stubUploadFile.rejects('S3Error');

    const req = httpMocks.createRequest();

    req.file = file;

    checkResult(req, 500);
  });

  it('Sending empty request.', () => {
    const req = httpMocks.createRequest();

    checkResult(req, 400);
  });
});
