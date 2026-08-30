import { Router, type Request, type Response } from 'express'

const router = Router()

router.post('/register', (req: Request, res: Response) => {
  res.status(201).json({ message: 'user signed up' })
})

router.post('/login', (req: Request, res: Response) => {
  res.status(201).json({ message: 'user logged in' })
})

export default router
