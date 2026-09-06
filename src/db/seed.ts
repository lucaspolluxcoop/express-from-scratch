import db from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
  console.log('Starting db seed...')
  try {
    console.log('clearing existing data...')

    await db.delete(entries)
    await db.delete(users)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(habitTags)

    console.log('creating new demo users...')

    const [testUser] = await db
      .insert(users)
      .values({
        email: 'test@test.com',
        password: '1234',
        firstName: 'Lucas',
        lastName: 'Manuel',
        username: 'test',
      })
      .returning()

    console.log('creating new demo tags...')

    const [healthTag] = await db
      .insert(tags)
      .values({
        name: 'Health',
        color: '#f0f0f0',
      })
      .returning()

    const [customTag] = await db
      .insert(tags)
      .values({
        name: 'Custom',
        color: '#600303',
      })
      .returning()

    console.log('creating new demo habits...')

    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: testUser.id,
        name: 'exercise',
        description: 'Daily Workout',
        frecuency: 'daily',
        targetCount: 1,
      })
      .returning()

    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })

    console.log('adding completion entries...')

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      })
    }

    console.log('database seeded succesfully')
    console.log(`(- Test user has email ${testUser.email}, username: ${testUser.username}, password: ${testUser.password}`)
  } catch (e) {
    console.error('seed failed', e)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => process.exit(1))
}

export default seed