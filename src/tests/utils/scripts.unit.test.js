import sinon from 'sinon';
import { PythonShell } from 'python-shell';
import { Scripts, createHeader } from '../../utils';

describe('Test Scripts handlers', () => {
  const stubPythonRun = sinon.stub(PythonShell, 'run');
  const stubCreateHeader = sinon.stub(createHeader, 'createHeader');

  describe('Test inferDatatype script', () => {
    const inferDatatypeVerify = () => {
      Scripts.inferDatatype('test/test.csv')
        .then(([columns]) => {
          expect(columns).toStrictEqual({
            columns: [{ name: 'Measure', datatype: 'Numeric' }],
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Script failed'));
        });
    };

    it('Resolve python script call', () => {
      stubPythonRun.yields(null, [
        {
          columns: [{ name: 'Measure', datatype: 'Numeric' }],
        },
      ]);
      stubCreateHeader.resolves(true);

      inferDatatypeVerify();
    });

    it('Reject createHeader', () => {
      stubPythonRun.yields(null, [
        {
          columns: [{ name: 'Measure', datatype: 'Numeric' }],
        },
      ]);
      stubCreateHeader.rejects(Error('Script failed'));

      inferDatatypeVerify();
    });

    it('Reject python script call', () => {
      stubPythonRun.yields(Error('Script failed'));

      inferDatatypeVerify();
    });
  });

  describe('Test getColumnNames script', () => {
    const getColumnsVerify = () => {
      Scripts.getColumnNames('test/test.csv')
        .then((columns) => {
          expect(columns).toStrictEqual([{ name: 'Measure' }]);
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Script failed'));
        });
    };

    it('Resolve python script call', () => {
      stubPythonRun.yields(null, [{ name: 'Measure' }]);

      getColumnsVerify();
    });

    it('Reject python script call', () => {
      stubPythonRun.yields(Error('Script failed'));

      getColumnsVerify();
    });
  });

  describe('Test getTypesFromHeader script', () => {
    const getTypesVerify = () => {
      Scripts.getTypesFromHeader('test/test.csv')
        .then((types) => {
          expect(types).toStrictEqual([{ datatype: 'Numeric' }]);
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Script failed'));
        });
    };

    it('Resolve python script call', () => {
      stubPythonRun.yields(null, [{ datatype: 'Numeric' }]);

      getTypesVerify();
    });

    it('Reject python script call', () => {
      stubPythonRun.yields(Error('Script failed'));

      getTypesVerify();
    });
  });
});
