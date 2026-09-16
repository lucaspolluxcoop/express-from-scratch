import type { Request, Response, NextFunction } from 'express'
import { type ZodType, ZodError } from 'zod'
import { ApiError } from './errorHandler.ts'

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        const detail = e.issues.map((err) => (err.path.join(' ') + err.message)).join(' - ')
        next(new ApiError(400,'ValidationError', detail))
        return
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
        const detail = e.issues.map((err) => (err.path.join(' ') + err.message)).join(' - ')
        next(new ApiError(400,'ParamsError', detail))
        return
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
        const detail = e.issues.map((err) => (err.path.join(' ') + ' : ' + err.message)).join(' - ')
        next(new ApiError(400,'QueryParamsError', detail))
        return
      }
      next(e)
    }
  }
}
