import sinon from 'sinon';
import { Knex } from '../../config';

import { Store, Header } from '../../models';

describe('Test Header Model methods', () => {
  const stubKnexSelect = sinon.stub(Knex, 'select');
  const stubKnexInsert = sinon.stub(Knex, 'insert');
  const stubKnexDelete = sinon.stub(Knex, 'delete');

  const stubHeaderDownload = sinon.stub(Store, 'getObject');
  const stubHeaderUpload = sinon.stub(Store, 'fPutObject');

  const mockedHeader = new Header(
    '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
    'uploads',
    'data.csv'
  );

  describe('Test getById Header method', () => {
    const headerGetIdVerify = (expectedError) => {
      Header.getById('24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e')
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
            bucketName: 'uploads',
            originalName: 'data.csv',
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error(expectedError));
        });
    };

    it('Resolves db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().resolves({
          uuid: '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
          bucketName: 'uploads',
          originalName: 'data.csv',
        }),
      });

      headerGetIdVerify(null);
    });

    it('Resolves db query for invalid uuid', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().resolves(undefined),
      });

      headerGetIdVerify('Invalid UUID.');
    });

    it('Rejects db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().rejects(Error('Forced error.')),
      });

      headerGetIdVerify('Forced error.');
    });
  });

  describe('Test create Header method', () => {
    const headerCreateVerify = () => {
      Header.create('24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e', 'uploads', {
        originalname: 'data.csv',
      })
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: '24ad2ae1-e6b3-4d30-8a5c-047f6774dc3e',
            bucketName: 'uploads',
            originalName: 'data.csv',
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced error'));
        });
    };

    it('Resolves db query', () => {
      stubKnexInsert.callsFake(() => {
        return {
          into: sinon.stub().resolves([0]),
        };
      });

      headerCreateVerify();
    });

    it('Rejects db query', () => {
      stubKnexInsert.callsFake(() => {
        return {
          into: sinon.stub().rejects(Error('Forced error')),
        };
      });

      headerCreateVerify();
    });
  });

  describe('Test downloadStream method', () => {
    const headerDownloadFileVerify = () => {
      mockedHeader
        .downloadStream()
        .then((result) => {
          expect(result).toBe('Success');
        })
        .catch((err) => {
          expect(err).toBe('S3Error');
        });
    };

    it('Resolve header upload promise.', () => {
      stubHeaderDownload.yields(null, 'Success');

      headerDownloadFileVerify();
    });

    it('Force internal server error', () => {
      stubHeaderDownload.yields('S3Error');

      headerDownloadFileVerify();
    });
  });

  describe('Test uploadFile method', () => {
    const headerUploadFileVerify = (file) => {
      mockedHeader
        .uploadFile(file)
        .then((result) => {
          expect(result).toBeTruthy();
        })
        .catch((err) => {
          expect(err).toBe('S3Error');
        });
    };

    it('Resolve header upload promise.', () => {
      stubHeaderUpload.yields(null);
      const file = { originalname: 'data.csv', path: '../testFiles/data.csv' };

      headerUploadFileVerify(file);
    });

    it('Force internal server error', () => {
      stubHeaderUpload.yields('S3Error');
      const file = { originalname: 'data.csv', path: '../testFiles/data.csv' };

      headerUploadFileVerify(file);
    });
  });

  describe('Test delete methods', () => {
    const headerDeleteVerify = () => {
      mockedHeader
        .delete()
        .then((result) => {
          expect(result).toBeTruthy();
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced error'));
        });
    };

    it('Resolves db query', () => {
      stubKnexDelete.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().resolves(),
      });

      headerDeleteVerify();
    });

    it('Rejects db query', () => {
      stubKnexDelete.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().rejects(Error('Forced error')),
      });

      headerDeleteVerify();
    });
  });
});
