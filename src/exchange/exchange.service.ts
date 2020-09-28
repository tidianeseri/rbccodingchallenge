import parse from 'csv-parse';
import HttpException from '../exceptions/HttpException';
import extract from 'extract-zip';
import fs from 'fs';
import Exchange from './exchange.interface';
import Database from '../interfaces/database.interface';
import MemoryDatabase from '../utils/memoryDb';

class ExchangeService {
  private numberFields = ['quarter', 'volume', 'percent_change_price', 'percent_change_volume_over_last_wk', 'previous_weeks_volume', 'percent_change_next_weeks_price', 'days_to_next_dividend', 'percent_return_next_dividend'];
  private moneyFields = ['open', 'high', 'low', 'close', 'next_weeks_open', 'next_weeks_close'];
  private database: Database;

  constructor() {
    const db = MemoryDatabase.getInstance();
    this.database = db.getData();
  }

  /**
   * Extract the zip file and parse the data
   * @param zipFilePath Path of the zip to extract
   * @param destinationDir Folder to extract zip
   */
  public async extractZippedDataSet(zipFilePath: string, destinationDir: string): Promise<Exchange[]> {
    const outputDir = `${destinationDir}_${new Date().getTime()}`;

    // Unzip data
    try {
      await extract(zipFilePath, { dir: outputDir });

      // Get the files with the extension .data
      const files = fs.readdirSync(outputDir).filter(fn => fn.endsWith('.data'));
      // this.database.exchanges = [];

      // tslint:disable-next-line: prefer-for-of
      for (const file of files) {
        await new Promise((resolve, reject) => {
          fs.createReadStream(`${outputDir}/${file}`)
          .pipe(parse({ columns: true, cast: (value, ctx) => {
            if (value === '') return null;

            // Convert the monetary string into number
            if (this.moneyFields.indexOf(ctx.column as string) > -1 && value.length > 0 && value[0] === '$') {
              return Number(value.substring(1));
            }

            // Convert numbers
            if (this.numberFields.indexOf(ctx.column as string) > -1) {
              return Number(value);
            }

            // Parse date
            if (ctx.column === 'date') {
              return new Date(value);
            }

            return value;
          } }))
          .on('data', (csvrow) => {
            const row = csvrow as Exchange;
            // console.log(row);
            this.database.exchanges.push(row);
          })
          .on('err', (err) => {
            reject(err);
          })
          .on('end', () => {
            this.clearDuplicates();

            // Clear the output directory
            fs.rmdirSync(outputDir, { recursive: true });
            resolve();
          });
        });
      }

      return this.database.exchanges;
    } catch (error) {
      throw new HttpException(500, error);
    }
  }

  /**
   * Clear duplicates in the database (based on ticker and date)
   */
  private clearDuplicates() {
    this.database.exchanges = this.database.exchanges.filter(
      (exch, index, self) => self.findIndex(t => t.stock === exch.stock
        && new Date(t.date).getDate() === new Date(exch.date).getDate()
        && new Date(t.date).getMonth() === new Date(exch.date).getMonth()
        && new Date(t.date).getFullYear() === new Date(exch.date).getFullYear()) === index);
  }

  /**
   * Get all the exchanges by ticker
   * @param ticker The ticker symbol
   */
  public getExchangesByTicker(ticker: string) {
    return this.database.exchanges.filter(exchange => exchange.stock.toLowerCase() === ticker.toLowerCase());
  }

  /**
   * Get all exchanges in the database
   */
  public getAllExchanges() {
    return this.database.exchanges;
  }

  /**
   * Add a new exchange in the database
   * @param data New exchange to add
   */
  public addNewExchange(data: Exchange) {
    this.database.exchanges.push(data);
    this.clearDuplicates();
  }
}

export default ExchangeService;
