import { Config } from '../config';

const validateDatatype = async (datatype) => {
  return new Promise((resolve, reject) => {
    if (Config.VALID_DATATYPES.includes(datatype)) {
      resolve();
    }
    reject(Error('Invalid datatype.'));
  });
};

export default validateDatatype;
