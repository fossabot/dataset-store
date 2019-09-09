import sinon from 'sinon';
import { Store, File } from '../../models';

describe('Test file management functions.', () => {
  const uploadFile = (file) => {
    File.uploadFile('testing', file)
      .then((result) => {
        expect(result).toBeTruthy();
      })
      .catch((err) => {
        expect(err).toBe('S3Error');
      });
  };

  describe('Test file upload function.', () => {
    const stubFileUpload = sinon.stub(Store, 'fPutObject');

    it('Resolve file upload promise.', () => {
      stubFileUpload.yields(null);
      const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

      uploadFile(file);
    });

    it('Force internal server error', () => {
      stubFileUpload.yields('S3Error');
      const file = { originalname: 'test.csv', path: '../testFiles/test.csv' };

      uploadFile(file);
    });
  });
});
