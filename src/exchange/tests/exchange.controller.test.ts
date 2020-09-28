import request from 'supertest';
import App from '../../app';
import ExchangeController from '../exchange.controller';

describe('Exchange controller', () => {
  describe('POST /exchange/', () => {
    describe('if exchange is not already present', () => {
      it('the response should be 200 OK', (done) => {
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

        const controller = new ExchangeController();
        controller.service.addNewExchange = jest.fn().mockReturnValue({ ...data });

        const app = new App([
          controller,
        ]);

        return request(app.getServer())
          .post(`${controller.path}`)
          .send(data)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).toEqual({ ...data, date: data.date.toISOString() });
            return done();
          });
      });
    });
  });
});
