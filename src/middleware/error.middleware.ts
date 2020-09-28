import HttpException from 'exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';

function errorMIddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'An error occured';
  response.status(status).send({ message, status });
}

export default errorMIddleware;
