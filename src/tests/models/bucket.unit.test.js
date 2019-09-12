import sinon from 'sinon';
import { Store, Bucket } from '../../models';

describe('Test bucket management functions', () => {
  const createBucket = () => {
    Bucket.createBucketStore('testing')
      .then((result) => {
        expect(result).toBeTruthy();
      })
      .catch((err) => {
        expect(err).toBe('S3Error');
      });
  };

  const verifyBucket = () => {
    Bucket.bucketExistsStore('testing')
      .then((exists) => {
        expect(exists).toBeTruthy();
      })
      .catch((err) => {
        expect(err).toBe('S3Error');
      });
  };

  describe('Test bucket create function.', () => {
    const stubMakeBucket = sinon.stub(Store, 'makeBucket');

    it('Resolve bucket create promise.', () => {
      stubMakeBucket.yields(null);
      createBucket();
    });

    it('Force to throw error', () => {
      stubMakeBucket.yields('S3Error');
      createBucket();
    });
  });

  describe('Test bucket exists function', () => {
    const stubBucketExists = sinon.stub(Store, 'bucketExists');

    it('Resolve bucket exists promise.', () => {
      stubBucketExists.yields(null, true);
      verifyBucket();
    });

    it('Force bucket exists internal error.', () => {
      stubBucketExists.yields('S3Error', null);
      verifyBucket();
    });
  });
});
