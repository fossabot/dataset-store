import fs from 'fs';
import sinon from 'sinon';
import { createHeader } from '../../utils';

describe('', () => {
  let stubWriteFile;
  const stubMkdir = sinon.stub(fs, 'mkdirSync');
  stubMkdir.returns(true);

  beforeEach(() => {
    stubWriteFile = sinon.stub(fs, 'writeFile');
  });

  afterEach(() => {
    stubWriteFile.restore();
  });

  const createHeaderVerify = () => {
    createHeader
      .createHeader('headers/text.txt', 'content')
      .then((result) => {
        expect(result).toBeTruthy();
      })
      .catch((err) => {
        expect(err).toStrictEqual(Error('Force Error'));
      });
  };

  it('', () => {
    stubWriteFile.yields(null);

    createHeaderVerify();
  });

  it('', () => {
    stubWriteFile.yields(Error('Force Error'));

    createHeaderVerify();
  });

  it('', () => {
    stubWriteFile.onCall(0).yields({ code: 'ENOENT' });
    stubWriteFile.onCall(1).yields(null);

    createHeaderVerify();
  });

  it('', () => {
    stubWriteFile.onCall(0).yields({ code: 'ENOENT' });
    stubWriteFile.onCall(1).yields(Error('Force Error'));

    createHeaderVerify();
  });
});
