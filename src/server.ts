import 'dotenv/config';
import App from './app';
import ExchangeController from './exchange/exchange.controller';
// import validateEnv from './utils/validateEnv';

// Validate environement variables. Commenting out for simplesness
// validateEnv();

const app = new App(
  [
    new ExchangeController(),
  ],
);

app.listen();
