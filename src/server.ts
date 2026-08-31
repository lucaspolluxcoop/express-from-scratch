import express, { type Express, type Request, type Response } from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'

const app: Express = express()
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3001']
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev', {
  skip: () => isTest(),
}))


app.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'hello' }).status(200)
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/habits', habitRoutes)

export { app }

export default app
