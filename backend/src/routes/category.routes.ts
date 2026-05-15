import { Router } from 'express'
import type { CategoryController } from '../controllers/category.controller.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { authorize } from '../middlewares/authorize.js'

export function createCategoryRouter(categoryController: CategoryController): Router {
  const router = Router()
  const adminOnly = [authMiddleware, authorize('admin')]

  router.get('/', categoryController.getAll)
  router.get('/:id', categoryController.getById)
  router.post('/', adminOnly, categoryController.create)
  router.put('/:id', adminOnly, categoryController.update)
  router.delete('/:id', adminOnly, categoryController.delete)

  return router
}
