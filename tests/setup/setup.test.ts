import { createTestUser, createTestHabit, cleanupDatabase } from "./dbHelpers.ts";

describe('Test setup', () => {
  test('should connnect to test db', async() =>{
    const { user, token } = await createTestUser()

    expect(user).toBeDefined()
    await cleanupDatabase()
  })
})