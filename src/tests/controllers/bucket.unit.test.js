import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { Bucket } from '../../controllers';
import { Bucket as BucketModel } from '../../models';

describe('Test bucket middleware controller', () => {
  const nextSpy = sinon.spy();
  const spy = sinon.spy(Bucket, 'verifyBucket');

  const stubBucketExists = sinon.stub(BucketModel, 'bucketExists');
  const stubCreateBucket = sinon.stub(BucketModel, 'createBucket');

  afterEach(() => {
    nextSpy.resetHistory();
    spy.resetHistory();
  });

  const verifySuccess = async () => {
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();

    await Bucket.verifyBucket(req, res, nextSpy);
    expect(nextSpy.calledOnce).toBeTruthy();
    [req, res] = spy.getCall(0).args;
    expect(res.statusCode).toBe(200);
  };

  const verifyFail = async () => {
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();

    await Bucket.verifyBucket(req, res, nextSpy);
    expect(nextSpy.notCalled).toBeTruthy();
    [req, res] = spy.getCall().args;
    expect(res.statusCode).toBe(500);
  };

  it('Testing bucket already exists', () => {
    stubBucketExists.resolves(true);

    verifySuccess();
  });

  it('Testing bucket exists throw error.', () => {
    stubBucketExists.rejects('S3Error');

    verifyFail();
  });

  it('Testing bucket doesnt exists, create that.', () => {
    stubBucketExists.resolves(false);
    stubCreateBucket.resolves(true);

    verifySuccess();
  });

  it('Testing fail on bucket create.', () => {
    stubBucketExists.resolves(false);
    stubCreateBucket.rejects('S3Error');

    verifyFail();
  });
});
