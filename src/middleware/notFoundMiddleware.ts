import { Request, Response } from 'express';
import { middlewareExceptionMessage } from './constant/middlewareExceptionMessage';

const notFound = (req: Request, res: Response) => {
    res.status(404).send(middlewareExceptionMessage.INALID_ROUTE);
};

export default notFound;
