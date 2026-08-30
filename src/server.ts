import express, { type Express, type Request, type Response } from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/UserRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'

const app: Express = express()

app.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'hello' }).status(200)
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

export { app }

export default app
