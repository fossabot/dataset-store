import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { Bucket } from '../../controllers';
import { Bucket as BucketModel } from '../../models';

describe('Test bucket middleware controller', () => {
  const nextSpy = sinon.spy();
  const spy = sinon.spy(Bucket, 'verifyBucket');

  const stubBucketExists = sinon.stub(BucketModel, 'bucketExistsStore');
  const stubCreateBucket = sinon.stub(BucketModel, 'createBucketStore');

  const verifySuccess = async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await Bucket.verifyBucket(req, res, nextSpy);
    expect(nextSpy.calledOnce).toBeTruthy();

    spy.resetHistory();
    nextSpy.resetHistory();
  };

  const verifyFail = async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await Bucket.verifyBucket(req, res, nextSpy);
    expect(nextSpy.notCalled).toBeTruthy();

    spy.resetHistory();
    nextSpy.resetHistory();
  };

  it('Testing bucket already exists', () => {
    stubBucketExists.resolves(true);

    verifySuccess();
  });

  it('Testing bucket doesnt exists, create that.', () => {
    stubBucketExists.resolves(false);
    stubCreateBucket.resolves(true);

    verifySuccess();
  });

  it('Testing bucket exists throw error.', () => {
    stubBucketExists.rejects('S3Error');

    verifyFail();
  });

  it('Testing fail on bucket create.', () => {
    stubBucketExists.resolves(false);
    stubCreateBucket.rejects('S3Error');

    verifyFail();
  });
});
