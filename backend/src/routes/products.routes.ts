import { Router } from 'express'
import type { ProductController } from '../controllers/product.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { authorize } from '../middlewares/authorize.js'

export function createProductsRouter(productController: ProductController): Router {
  const router = Router()
  const adminOnly = [authMiddleware, authorize('admin')]

  router.get('/', productController.getAll)
  router.get('/:id', productController.getById)
  router.post('/', adminOnly, productController.create)
  router.put('/:id', adminOnly, productController.update)
  router.delete('/:id', adminOnly, productController.delete)

  return router
}
