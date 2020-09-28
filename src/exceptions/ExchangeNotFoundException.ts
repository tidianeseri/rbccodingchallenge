import HttpException from './HttpException';

export class ExchangeNotFound extends HttpException {
  constructor(ticker: string) {
    super(400, `Exchanges ${ticker} could not be found`);
  }
}