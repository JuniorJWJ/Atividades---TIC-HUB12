import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../controllers/category.controller.js'
import { validateData } from '../middlewares/validateData.js'
import {
  categoryParamsSchema,
  categoryQueryPaginationSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema.js'

export const categoryRouter = Router()

categoryRouter.get('/', validateData(categoryQueryPaginationSchema, 'query'), listCategories)

categoryRouter.get('/:id', validateData(categoryParamsSchema, 'params'), getCategoryById)

categoryRouter.post('/', validateData(createCategorySchema, 'body'), createCategory)

categoryRouter.put(
  '/:id',
  validateData(categoryParamsSchema, 'params'),
  validateData(updateCategorySchema, 'body'),
  updateCategory,
)

categoryRouter.delete('/:id', validateData(categoryParamsSchema, 'params'), deleteCategory)
