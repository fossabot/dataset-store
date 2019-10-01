import { Knex } from '../config';

class Column {
  constructor(uuid, datasetId, name, datatype) {
    this.uuid = uuid;
    this.datasetId = datasetId;
    this.name = name;
    this.datatype = datatype;
  }

  static fromDBRecord(record) {
    return new this(
      record.uuid,
      record.datasetId,
      record.name,
      record.datatype
    );
  }

  static async getAll(datasetId) {
    return new Promise((resolve, reject) => {
      Knex.select('*')
        .from('columns')
        .where('datasetId', '=', datasetId)
        .then((rows) => {
          const columns = rows.map((r) => {
            return this.fromDBRecord(r);
          });
          resolve(columns);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getById(uuid) {
    return new Promise((resolve, reject) => {
      Knex.select('*')
        .from('columns')
        .where('uuid', '=', uuid)
        .first()
        .then((row) => {
          if (row) {
            resolve(this.fromDBRecord(row));
          }
          reject(Error('Invalid UUID.'));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async create(uuid, name, datatype, datasetId) {
    return new Promise((resolve, reject) => {
      Knex.insert({
        uuid,
        name,
        datatype,
        datasetId,
      })
        .into('columns')
        .then(() => {
          resolve(this.fromDBRecord({ uuid, name, datatype, datasetId }));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async update(newDatatype) {
    const datatype = newDatatype || this.datatype;

    return new Promise((resolve, reject) => {
      Knex.update({ datatype })
        .from('columns')
        .where('uuid', '=', this.uuid)
        .then(() => {
          this.datatype = datatype;
          resolve(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export { Column as default };
