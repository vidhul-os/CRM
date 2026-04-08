import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export const logger = morgan('dev')
