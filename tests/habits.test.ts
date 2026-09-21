import request from 'supertest'
import app from '../src/server.ts'
import {
  cleanupDatabase,
  createTestHabit,
  createTestUser,
} from './setup/dbHelpers.ts'
import db from '../src/db/connection.ts'
import { habits, type Habit } from '../src/db/schema.ts'
import { eq } from 'drizzle-orm'

describe('Habits Tests', () => {
  afterEach(async () => {
    await cleanupDatabase()
  })

  describe('GET /api/habits/', () => {
    it('should only return the authenticated user habits', async () => {
      const testUser1 = await createTestUser()
      const testUser2 = await createTestUser()

      await createTestHabit(testUser1.user.id)
      await createTestHabit(testUser1.user.id)
      await createTestHabit(testUser1.user.id)
      await createTestHabit(testUser2.user.id)

      const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .expect(200)

      const allBelongToUser: boolean = response.body.habits.every(
        (h: Habit) => h.userId === testUser1.user.id,
      )

      expect(
        allBelongToUser,
        'one or more habits are not from the authenticated user',
      ).toBe(true)
      expect(response.body.habits).toHaveLength(3)
    })
  })

  describe('POST /api/habits', () => {
    it('should create a new habit for authenticated user', async () => {
      const testUser = await createTestUser()
      const habitData = {
        name: 'habit test',
        description: 'habit description',
        frequency: 'daily',
        targetCount: 2,
      }

      const response = await request(app)
        .post('/api/habits')
        .send(habitData)
        .set('Authorization', `Bearer ${testUser.token}`)
        .expect(201)

      const habit = await db.query.habits.findFirst({
        where: eq(habits.id, response.body.habit.id),
      })

      expect(habit).toBeDefined()
      expect(habit?.userId).toBe(testUser.user.id)
      expect(habit).toMatchObject(habitData)
    })
  })
})
