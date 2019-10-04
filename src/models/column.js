import { Knex } from '../config';

class Column {
  constructor(uuid, headerId, name, datatype) {
    this.uuid = uuid;
    this.headerId = headerId;
    this.name = name;
    this.datatype = datatype;
  }

  static fromDBRecord(record) {
    return new this(record.uuid, record.headerId, record.name, record.datatype);
  }

  static async getAll(headerId) {
    return new Promise((resolve, reject) => {
      Knex.select('*')
        .from('columns')
        .where('headerId', '=', headerId)
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

  static async create(uuid, name, datatype, headerId) {
    return new Promise((resolve, reject) => {
      Knex.insert({
        uuid,
        name,
        datatype,
        headerId,
      })
        .into('columns')
        .then(() => {
          resolve(this.fromDBRecord({ uuid, name, datatype, headerId }));
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
