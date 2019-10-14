import { Knex } from '../config';
import minioClient from './store';

class Dataset {
  constructor(uuid, bucketName, originalName, path) {
    this.uuid = uuid;
    this.bucketName = bucketName;
    this.originalName = originalName;
    this.path = path;
  }

  static fromDBRecord(record) {
    return new this(
      record.uuid,
      record.bucketName,
      record.originalName,
      record.path
    );
  }

  static getById(uuid) {
    return new Promise((resolve, reject) => {
      Knex.select('*')
        .from('datasets')
        .where('uuid', '=', uuid)
        .first()
        .then((row) => {
          if (row) {
            resolve(this.fromDBRecord(row));
          } else {
            reject(Error('Invalid UUID.'));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(uuid, bucketName, file, experimentId) {
    const path = `${experimentId}/${uuid}`;
    const originalName = file.originalname;
    return new Promise((resolve, reject) => {
      Knex.insert({
        uuid,
        bucketName,
        originalName,
        path,
      })
        .into('datasets')
        .then(() => {
          resolve(this.fromDBRecord({ uuid, bucketName, originalName, path }));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      minioClient.fPutObject(
        this.bucketName,
        this.path,
        file.path,
        {
          'Content-Type': 'application/octet-stream',
        },
        (err) => {
          if (err) reject(err);
          resolve(true);
        }
      );
    });
  }

  downloadStream() {
    return new Promise((resolve, reject) => {
      minioClient.getObject(this.bucketName, this.path, (err, stream) => {
        if (err) reject(err);
        resolve(stream);
      });
    });
  }
}

export { Dataset as default };
