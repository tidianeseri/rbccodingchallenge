
import {
  cleanEnv, port,
} from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
  });
}

export default validateEnv;
