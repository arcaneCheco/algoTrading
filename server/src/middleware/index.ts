import { Request, Response, NextFunction } from "express";

interface ResponseError extends Error {
  status?: number;
}

export const errorHandler = (
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
};
