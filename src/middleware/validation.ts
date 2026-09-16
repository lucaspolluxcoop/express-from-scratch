import type { Request, Response, NextFunction } from 'express'
import { type ZodType, ZodError } from 'zod'

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Errors',
          detail: e.issues.map((err) => ({
            field: err.path.join(' '),
            message: err.message
          }))
        })
      }
      next(e)
    }
  }
}

export const validateParams = <T extends Request['params']>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentParams = schema.parse(req.params)
      req.params = currentParams
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation params',
          detail: e.issues.map((err) => ({
            field: err.path.join(' '),
            message: err.message
          }))
        })
      }
      next(e)
    }
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation query params',
          detail: e.issues.map((err) => ({
            field: err.path.join(' '),
            message: err.message
          }))
        })
      }
      next(e)
    }
  }
}
