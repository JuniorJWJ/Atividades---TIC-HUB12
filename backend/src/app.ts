import express from 'express'
import { CategoryController } from './controllers/category.controller.js'
import { ProductController } from './controllers/product.controller.js'
import { database } from './database/connection.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { logger } from './middlewares/logger.js'
import { CategoryRepository } from './repositories/CategoryRepository.js'
import { ProductRepository } from './repositories/ProductRepository.js'
import { authRouter } from './routes/auth.routes.js'
import { createCategoryRouter } from './routes/category.routes.js'
import { ordersRouter } from './routes/orders.routes.js'
import { createProductsRouter } from './routes/products.routes.js'
import { CategoryService } from './services/CategoryService.js'
import { ProductService } from './services/ProductService.js'

const categoryRepository = new CategoryRepository(database)
const productRepository = new ProductRepository(database)
const categoryService = new CategoryService(categoryRepository)
const productService = new ProductService(productRepository, categoryRepository)
const categoryController = new CategoryController(categoryService)
const productController = new ProductController(productService)

export const app = express()

app.use(express.json())
app.use(logger)

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/auth', authRouter)
app.use('/category', createCategoryRouter(categoryController))
app.use('/products', createProductsRouter(productController))
app.use('/orders', ordersRouter)
app.use(errorMiddleware)
