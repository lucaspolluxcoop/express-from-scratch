import { z } from 'zod'

export const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional()
})

export const updateHabitSchema = createHabitSchema.partial()

export const completeParamsSchema = z.object({
  id: z.string(),
})