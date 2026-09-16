import { Router, type Request, type Response } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  deleteHabit,
  getUserHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import {
  createHabitSchema,
  completeParamsSchema,
  updateHabitSchema,
} from '../validations/habitValidations.ts'

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.get('/:id', validateParams(completeParamsSchema), getUserHabit)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch(
  '/:id',
  validateParams(completeParamsSchema),
  validateBody(updateHabitSchema),
  updateHabit,
)

router.delete('/:id', validateParams(completeParamsSchema), deleteHabit)

router.post(
  '/:id/complete',
  validateParams(completeParamsSchema),
  validateBody(createHabitSchema),
  (req: Request, res: Response) => {
    res.status(201).json({ message: 'completed habit' })
  },
)

export default router
