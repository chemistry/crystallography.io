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
  if (e.status && e.title && e.detail) {
    errDTO = err as ErrorDTO;
  } else {
    errDTO = {
      status: 500,
      title: 'Unknown Error',
      detail: err.toString(),
    } as ErrorDTO;
    console.error(err);
  }
  res.status(errDTO.status).json({
    errors: [errDTO],
  });
}
