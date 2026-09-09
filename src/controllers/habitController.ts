import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      frequency,
      targetCount,
      tagIds,
    }: {
      name: string
      description: string
      frequency: string
      targetCount: number
      tagIds: string[]
    } = req.body

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    const userId = req.user.id

    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId: tagId,
        }))

        await tx.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    return res.status(201).json({
      message: 'Habit created',
      habit: result,
    })
  } catch (e) {
    console.error('Create habit error', e)
    return res.status(500).json({ error: 'Failed to create habit' })
  }
}

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })

    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.id),
      with: {
        habitTags: {
          with: {
            tag: true
          }
        }
      },
      orderBy: [desc(habits.createdAt)]
    })

    const habitsWithTags = userHabitsWithTags.map(habit => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined
    }))

    return res.json({
      habits: habitsWithTags
    })
  } catch (e) {
    console.error('Gets habits error', e)
    return res.status(500).json({ error: 'Failed to fetch habits' })
  }
}
