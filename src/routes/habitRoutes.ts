import { Router, type Request, type Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({ messasge: 'all habits' })
})

router.get('/:id', (req: Request, res: Response) => {
  res.json({ messasge: 'current habit' })
})

router.post('/', (req: Request, res: Response) => {
  res.json({ messasge: 'created habit' }).status(201)
})

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ messasge: 'deleted habit' }).status(204)
})

router.post('/:id/complete', (req: Request, res: Response) => {
  res.json({ messasge: 'completed habit' }).status(201)
})

export default router
