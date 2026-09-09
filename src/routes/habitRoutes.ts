import { Router, type Request, type Response } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z, type ZodType } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit, getUserHabits } from '../controllers/habitController.ts'

const createHabitSchema: ZodType = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.string(),
  tagIds: z.array(z.string()).optional()
})

const completeParamsSchema: ZodType = z.object({
  id: z.string().max(2),
})

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: 'current habit' })
})

router.post('/', validateBody(createHabitSchema), createHabit,
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
