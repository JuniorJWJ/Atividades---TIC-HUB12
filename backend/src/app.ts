import express from 'express'
import { logger } from './middlewares/logger.js'
import { ordersRouter } from './routes/orders.routes.js'
import { productsRouter } from './routes/products.routes.js'

export const app = express()

app.use(express.json())
app.use(logger)

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
