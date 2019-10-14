import sinon from 'sinon';

import { Knex } from '../../config';
import { Column } from '../../models';

describe('Test Column Model methods', () => {
  const stubKnexSelect = sinon.stub(Knex, 'select');
  const stubKnexInsert = sinon.stub(Knex, 'insert');
  const stubKnexUpdate = sinon.stub(Knex, 'update');

  describe('Test getById Column method', () => {
    const columnGetByIdVerify = (expectedError) => {
      Column.getById('a2958bc1-a2c5-424f-bcb3-cf4701f4a423')
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
            headerId: '2864d96c-9171-43d1-9b89-af9828c30e61',
            name: 'Measure1',
            datatype: 'Numeric',
            position: 0,
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
          uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
          headerId: '2864d96c-9171-43d1-9b89-af9828c30e61',
          name: 'Measure1',
          datatype: 'Numeric',
          position: 0,
        }),
      });

      columnGetByIdVerify(null);
    });

    it('Resolves db query for invalid uuid', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().resolves(undefined),
      });

      columnGetByIdVerify('Invalid UUID.');
    });

    it('Rejects db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        first: sinon.stub().rejects(Error('Forced error.')),
      });

      columnGetByIdVerify('Forced error.');
    });
  });

  describe('Test getAll Columns method', () => {
    const columnGetAllVerify = () => {
      Column.getAll()
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual([
            {
              uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
              headerId: '2864d96c-9171-43d1-9b89-af9828c30e61',
              name: 'Measure1',
              datatype: 'Numeric',
              position: '0',
            },
          ]);
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced error'));
        });
    };

    it('Resolves db query', () => {
      stubKnexSelect.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().returnsThis(),
        orderBy: sinon.stub().resolves([
          {
            uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
            headerId: '2864d96c-9171-43d1-9b89-af9828c30e61',
            name: 'Measure1',
            datatype: 'Numeric',
            position: '0',
          },
        ]),
      });

      columnGetAllVerify();
    });

    it('Rejects db query', () => {
      stubKnexSelect.callsFake(() => {
        return {
          from: sinon.stub().returnsThis(),
          where: sinon.stub().returnsThis(),
          orderBy: sinon.stub().rejects(Error('Forced error')),
        };
      });

      columnGetAllVerify();
    });
  });

  describe('Test create Column method', () => {
    const columnCreateVerify = () => {
      Column.create(
        'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        'Measure1',
        'Numeric',
        0,
        '2864d96c-9171-43d1-9b89-af9828c30e61'
      )
        .then((result) => {
          expect(result).not.toBeNull();
          expect(result).toEqual({
            uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
            headerId: '2864d96c-9171-43d1-9b89-af9828c30e61',
            name: 'Measure1',
            position: 0,
            datatype: 'Numeric',
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

      columnCreateVerify();
    });

    it('Rejects db query', () => {
      stubKnexInsert.callsFake(() => {
        return {
          into: sinon.stub().rejects(Error('Forced error')),
        };
      });

      columnCreateVerify();
    });
  });

  describe('Test update Column method', () => {
    const columnUpdateVerify = () => {
      const columnMocked = new Column(
        'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        '2864d96c-9171-43d1-9b89-af9828c30e61',
        'Measure1',
        'Numeric',
        0
      );

      columnMocked
        .update('factor')
        .then((result) => {
          expect(result.datatype).toBe('factor');

          columnMocked.update().then((result_) => {
            expect(result_.datatype).toBe('factor');
          });
        })
        .catch((err) => {
          expect(err).toStrictEqual(Error('Forced error'));
        });
    };

    it('Resolves db query', () => {
      stubKnexUpdate.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().resolves(),
      });

      columnUpdateVerify();
    });

    it('Rejects db query', () => {
      stubKnexUpdate.returns({
        from: sinon.stub().returnsThis(),
        where: sinon.stub().rejects(Error('Forced error')),
      });

      columnUpdateVerify();
    });
  });
});
