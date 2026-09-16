import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts'
import { eq, and, desc, inArray } from 'drizzle-orm'
import type { completeParamsSchema } from '../validations/habitValidations.ts'
import { z } from 'zod'

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
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }))

    return res.json({
      habits: habitsWithTags,
    })
  } catch (e) {
    console.error('Gets habits error', e)
    return res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const getUserHabit = async (
  req: AuthenticatedRequest<z.infer<typeof completeParamsSchema>>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' })
    const userId = req.user.id

    const id = req.params.id
    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, id), eq(habits.userId, userId)),
    })

    if (!habit) {
      return res.status(400).json({ message: 'habit not found' })
    }

    return res.json({ message: 'Exito', habit })
  } catch (e) {
    console.error('get habit error', e)
    return res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const updateHabit = async (
  req: AuthenticatedRequest<z.infer<typeof completeParamsSchema>>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    const userId = req.user.id
    const id = req.params.id
    const { tagIds, ...updates } = req.body

    const result = db.transaction(async (tx) => {
      const [updateHabit] = await tx
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning()

      if (!updateHabit) {
        return res.status(401).end()
      }

      if (tagIds !== undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, id))

        if (tagIds.length > 0) {
          const habitTagsValues = tagIds.map((tagId: string) => ({
            habitId: id,
            tagId,
          }))

          await tx.insert(habitTags).values(habitTagsValues)
        }
      }

      return updateHabit
    })

    res.json({
      message: 'habit updated',
      habit: result,
    })
  } catch (e) {
    console.error('Update habit error', e)
    return res.status(500).json({ error: 'Failed to update habit' })
  }
}

export const deleteHabit = async (
  req: AuthenticatedRequest<z.infer<typeof completeParamsSchema>>,
  res: Response,
) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'unauthorized' })
    const userId = req.user.id
    const id = req.params.id

    const habit = await db.query.habits.findFirst({
      where: and(eq(habits.id, id), eq(habits.userId, userId)),
    })

    if (!habit) return res.status(400).json({ message: 'Habit not found' })

    await db.delete(habits).where(eq(habits.id, habit.id))

    return res.status(204).json({ message: 'Habit deleted' })
  } catch (e) {
    console.error('Delete habits error', e)
    return res.status(500).json({ error: 'Failed to delete habit' })
  }
}
