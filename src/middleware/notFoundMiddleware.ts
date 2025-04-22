
import { Request, Response } from 'express';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .send(middlewareExceptionMessage.INALID_ROUTE);
};

export default notFound;
