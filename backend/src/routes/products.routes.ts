import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
} from '../controllers/product.controller.js'
import { validateData } from '../middlewares/validateData.js'
import {
  createProductSchema,
  productParamsSchema,
  productQuerySchema,
} from '../schemas/product.schema.js'

export const productsRouter = Router()

productsRouter.get('/', validateData(productQuerySchema, 'query'), listProducts)

productsRouter.get('/:id', validateData(productParamsSchema, 'params'), getProductById)

productsRouter.post('/', validateData(createProductSchema, 'body'), createProduct)

productsRouter.delete('/:id', validateData(productParamsSchema, 'params'), deleteProduct)
