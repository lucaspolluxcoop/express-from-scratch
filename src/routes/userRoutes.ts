import { Router, type Request, type Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'all users' })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: 'current user' })
})

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: 'user updated' }).status(201)
})

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: 'user deleted' }).status(204)
})

export default router
