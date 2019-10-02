import sinon from 'sinon';
import httpMocks from 'node-mocks-http';

import { Column as Controller } from '../../controllers';
import { Column as Model } from '../../models';

describe('Test Column Controller methods', () => {
  const columnMocked = new Model(
    'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
    '2864d96c-9171-43d1-9b89-af9828c30e61',
    'Measure1',
    'Numeric'
  );

  const stubColumnGetById = sinon.stub(Model, 'getById');
  const stubColumnGetAll = sinon.stub(Model, 'getAll');
  const stubColumnCreate = sinon.stub(Model, 'create');
  const stubColumnUpdate = sinon.stub(columnMocked, 'update');

  describe('Test getById Column controller', () => {
    const columnGetByIdVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/datasets/:datasetId/columns/:columnId',
        params: {
          datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
          columnId: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.getById(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves getById model', () => {
      stubColumnGetById.resolves({
        uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
        name: 'Measure1',
        datatype: 'Numeric',
      });

      columnGetByIdVerify(200);
    });

    it('Rejects getById model, invalid uuid', () => {
      stubColumnGetById.rejects(Error('Invalid UUID.'));

      columnGetByIdVerify(400);
    });

    it('Rejects getById model, forced internal server error', () => {
      stubColumnGetById.rejects(Error('Forced error'));

      columnGetByIdVerify(500);
    });
  });

  describe('Test getAll Columns controller', () => {
    const columnGetAllVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/datasets/:datasetId/columns',
        params: {
          datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.getAll(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves getAll model', () => {
      stubColumnGetAll.resolves([
        {
          uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
          datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
          name: 'Measure1',
          datatype: 'Numeric',
        },
      ]);

      columnGetAllVerify(200);
    });

    it('Rejects getAll model', () => {
      stubColumnGetAll.rejects(Error('Forced error'));

      columnGetAllVerify(500);
    });
  });

  describe('Test Create Column controller', () => {
    const columnCreateVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/datasets/:datasetId/columns',
        params: {
          datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
        },
        body: {
          name: 'Measure1',
          datatype: 'Numeric',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.create(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves create model', () => {
      stubColumnCreate.resolves({
        uuid: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
        name: 'Measure1',
        datatype: 'Numeric',
      });

      columnCreateVerify(200);
    });

    it('Rejects create model', () => {
      stubColumnCreate.rejects(Error('Forced error'));

      columnCreateVerify(500);
    });
  });

  describe('Test Update Column controller', () => {
    const columnUpdateVerify = async (expectedCode) => {
      const req = httpMocks.createRequest({
        method: 'PATCH',
        url: '/datasets/:datasetId/columns/:columnId',
        params: {
          datasetId: '2864d96c-9171-43d1-9b89-af9828c30e61',
          columnId: 'a2958bc1-a2c5-424f-bcb3-cf4701f4a423',
        },
        body: {
          datatype: 'Categorical',
        },
      });
      const res = httpMocks.createResponse();

      const result = await Controller.update(req, res);

      expect(result.statusCode).toBe(expectedCode);
    };

    it('Resolves update model', () => {
      stubColumnUpdate.resolves(columnMocked);

      stubColumnGetById.resolves(columnMocked);

      columnUpdateVerify(200);
    });

    it('Rejects update model', () => {
      stubColumnUpdate.rejects(Error('Forced error'));

      stubColumnGetById.resolves(columnMocked);

      columnUpdateVerify(500);
    });

    it('Rejects getById model, forced internal server error', () => {
      stubColumnGetById.rejects(Error('Forced error'));

      columnUpdateVerify(500);
    });

    it('Rejects getById model, invalid uuid', () => {
      stubColumnGetById.rejects(Error('Invalid UUID.'));

      columnUpdateVerify(400);
    });
  });
});
