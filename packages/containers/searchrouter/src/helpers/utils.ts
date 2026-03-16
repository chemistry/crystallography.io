import type { NextFunction, Request, Response } from 'express';

export interface ErrorDTO {
  status: number;
  title: string;
  detail: string;
}

export function errorHandler(
  err: Error | ErrorDTO,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let errDTO: ErrorDTO;
  const e = err as ErrorDTO;
  if (e.title && e.detail) {
    errDTO = {
      status: typeof e.status === 'number' ? e.status : 500,
      title: e.title,
      detail: e.detail,
    };
  } else {
    errDTO = {
      status: 500,
      title: 'Unknown Error',
      detail: err.toString(),
    };
    console.error(err);
  }
  res.status(errDTO.status).json({
    errors: [errDTO],
  });
}
