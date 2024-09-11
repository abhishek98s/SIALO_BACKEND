import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

const joiValidationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      res.status(422).json({ status: false, message });
    }
  };
};

export const joiFileValidationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { error } = schema.validate(req.file);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');
      res.status(422).json({ error: message });
    }
  };
};


export default joiValidationMiddleware;
