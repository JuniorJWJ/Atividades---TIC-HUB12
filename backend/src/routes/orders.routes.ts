import { Router, type Request, type Response } from 'express'
import { validateOrderBody } from '../middlewares/validateOrderBody.js'
import type { CreateOrderBody, UpdateOrderStatusBody } from '../types/order.js'

type OrderParams = {
  id: string
}

type UpdateOrderResponse = {
  id: number
  status: string
}

export const ordersRouter = Router()

ordersRouter.post(
  '/',
  validateOrderBody,
  (req: Request<unknown, CreateOrderBody, CreateOrderBody>, res: Response<CreateOrderBody>): void => {
    res.status(201).json(req.body)
  },
)

ordersRouter.patch(
  '/:id',
  (
    req: Request<OrderParams, UpdateOrderResponse, UpdateOrderStatusBody>,
    res: Response<UpdateOrderResponse>,
  ): void => {
    const id = Number(req.params.id)
    const { status } = req.body

    res.status(200).json({
      id,
      status,
    })
  },
)

ordersRouter.delete('/:id', (_req: Request<OrderParams>, res: Response): void => {
  res.status(204).send()
})
