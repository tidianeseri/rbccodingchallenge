import HttpException from '../exceptions/HttpException';
import { InvalidUploadedFiles, NoFileUploadedException } from '../exceptions/UploadException';
import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import formidable from 'formidable';
import Controller from '../interfaces/controller.interface';
import Exchange from './exchange.interface';
import path from 'path';
import ExchangeService from './exchange.service';
import { ExchangeNotFound } from '../exceptions/ExchangeNotFoundException';
import { CreateExchangeDto } from './exchange.dto';
import validationMiddleware from '../middleware/validation.middleware';

class ExchangeController implements Controller {
  public path = '/exchange';
  public router = Router();
  public service = new ExchangeService();
  private uploadDir = 'uploads';
  private uploadPath = path.join(__dirname, '../../', this.uploadDir);

  constructor() {
    this.initializeRoutes();
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath);
    }
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload`, this.uploadDataSet);
    this.router.get(`${this.path}/:ticker`, this.getExchangesByTicker);
    this.router.get(`${this.path}`, this.getAllExchanges);
    this.router.post(this.path, validationMiddleware(CreateExchangeDto), this.createRecord);
  }

  private getAllExchanges = async (req: Request, res: Response, nxt: NextFunction) => {
    try {
      const exchanges = this.service.getAllExchanges();
      res.json({ exchanges, count: exchanges.length });
    } catch (error) {
      nxt(new HttpException(500, error));
    }
  }

  private getExchangesByTicker = async (req: Request, res: Response, nxt: NextFunction) => {
    try {
      const ticker = req.params.ticker;
      const exchanges = this.service.getExchangesByTicker(ticker);

      if (exchanges.length > 0) {
        res.send(exchanges);
      } else {
        nxt(new ExchangeNotFound(ticker));
      }
    } catch (error) {
      nxt(new HttpException(500, error));
    }
  }

  private createRecord = async (req: Request, res: Response, nxt: NextFunction) => {
    try {
      const data: CreateExchangeDto = req.body;
      const newExchange = data as Exchange;
      this.service.addNewExchange(newExchange);
      res.send(data);
    } catch (error) {
      console.log(error);
      nxt(new HttpException(500, error));
    }
  }

  private uploadDataSet = async (req: Request, res: Response, nxt: NextFunction) => {
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024; // 50 Mb file size
    form.uploadDir = this.uploadDir;
    form.keepExtensions = true;
    form.multiples = false;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        nxt(new HttpException(500, err));
      } else if (Object.keys(files).length === 0) {
        nxt(new NoFileUploadedException());
      } else {
        // Iterate all uploaded files and get their path, extension, final extraction path
        const filesInfo = Object.keys(files).map((key) => {
          const file = files[key];
          const filePath = file.path;
          const fileExt = path.extname(file.name);
          const fileName = path.basename(file.name, fileExt);
          const destDir = path.join(this.uploadPath, fileName);

          return { filePath, fileExt, destDir };
        });

        // Check whether uploaded files are zip files
        const validFiles = filesInfo.every(({ fileExt }) => fileExt === '.zip');

        if (!validFiles) {
          nxt(new InvalidUploadedFiles());
        }

        const exchanges: Exchange[] = [];

        try {

          // Call the service to extract the zip and parse the input
          for (const fileInfo of filesInfo) {
            const { filePath, destDir } = fileInfo;
            const ret = await this.service.extractZippedDataSet(filePath, destDir);
            exchanges.push(...ret);
          }

          // TODO: delete the uploaded file

          res.json({ exchanges, count: exchanges.length });
        } catch (err) {
          nxt(new HttpException(500, err));
        }
      }
    });
  }
}

export default ExchangeController;
