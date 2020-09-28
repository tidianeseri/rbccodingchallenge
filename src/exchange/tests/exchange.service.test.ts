import ExchangeService from '../exchange.service';

describe('Exchange Service', () => {
  describe('create a new record', () => {
    it('should add it to the database', () => {
      const data = {
        quarter: 1,
        stock: 'AA',
        date: new Date('2011-01-14T05:00:00.000Z'),
        open: 16.71,
        high: 16.71,
        low: 15.64,
        close: 15.97,
        volume: 242963398,
        percent_change_price: -4.42849,
        percent_change_volume_over_last_wk: 1.380223028,
        previous_weeks_volume: 239655616,
        next_weeks_open: 16.19,
        next_weeks_close: 15.79,
        percent_change_next_weeks_price: -2.47066,
        days_to_next_dividend: 19,
        percent_return_next_dividend: 0.187852,
      };

      const service = new ExchangeService();

      expect(service.getAllExchanges().length).toEqual(0);
      expect(service.addNewExchange(data));
      expect(service.getAllExchanges().length).toEqual(1);
    });
  });
});
