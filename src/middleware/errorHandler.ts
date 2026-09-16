import type { Request, Response, NextFunction } from 'express'
import env from '../../env.ts'

export class ApiError extends Error {
  status: number
  name: string
  message: string
  constructor(status:number, name:string, message:string) {
    super()
    this.message = message
    this.name = name
    this.status = status
  }
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err.stack)
  let status = err.status || 500
  let message = err.message || 'Internal server error'

  if (err.name === 'UnauthorizedError') {
    status = 401
    message = 'unauthorized'
  }

  return res.status(status).json({
    error: message,
    ...(env.APP_STAGE === 'dev' && {
      stack: err.stack,
      details: err.message
    }),
  })
}
