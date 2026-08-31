import { Router, type Request, type Response } from 'express'
import {
  validateBody,
  validateQuery,
  validateParams,
} from '../middleware/validation.ts'
import { z, type ZodType } from 'zod'

const createHabitSchema: ZodType = z.object({
  name: z.string(),
})

const completeParamsSchema: ZodType = z.object({
  id: z.string().max(2),
})

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'all habits' })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: 'current habit' })
})

router.post(
  '/',
  validateBody(createHabitSchema),
  (req: Request, res: Response) => {
    res.status(201).json({ message: 'created habit' })
  },
)

router.delete('/:id', (req: Request, res: Response) => {
  res.status(204).json({ message: 'deleted habit' })
})

router.post(
  '/:id/complete',
  validateParams(completeParamsSchema),
  validateBody(createHabitSchema),
  (req: Request, res: Response) => {
    res.status(201).json({ message: 'completed habit' })
  },
)

export default router
