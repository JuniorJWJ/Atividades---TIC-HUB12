import type { Request, Response } from 'express'
import { categories } from '../data/categories.js'
import type {
  CategoryParams,
  CategoryQueryPagination,
  CreateCategoryBody,
  UpdateCategoryBody,
} from '../schemas/category.schema.js'
import type { Category } from '../types/category.js'

type ErrorResponse = {
  message: string
}

export function listCategories(_req: Request, res: Response<Category[]>): void {
  const { page, size } = res.locals.query as CategoryQueryPagination
  const start = (page - 1) * size
  const end = start + size

  res.status(200).json(categories.slice(start, end))
}

export function getCategoryById(_req: Request, res: Response<Category | ErrorResponse>): void {
  const { id } = res.locals.params as CategoryParams
  const category = categories.find((item) => item.id === id)

  if (!category) {
    res.status(404).json({ message: 'Categoria não encontrada.' })
    return
  }

  res.status(200).json(category)
}

export function createCategory(_req: Request, res: Response<Category>): void {
  const body = res.locals.body as CreateCategoryBody
  const category: Category = {
    id: crypto.randomUUID(),
    ...body,
  }

  categories.push(category)
  res.status(201).json(category)
}

export function updateCategory(_req: Request, res: Response<Category | ErrorResponse>): void {
  const { id } = res.locals.params as CategoryParams
  const body = res.locals.body as UpdateCategoryBody
  const categoryIndex = categories.findIndex((item) => item.id === id)

  if (categoryIndex < 0) {
    res.status(404).json({ message: 'Categoria não encontrada.' })
    return
  }

  const updatedCategory = {
    ...categories[categoryIndex],
    ...body,
  }

  categories[categoryIndex] = updatedCategory
  res.status(200).json(updatedCategory)
}

export function deleteCategory(_req: Request, res: Response): void {
  const { id } = res.locals.params as CategoryParams
  const categoryIndex = categories.findIndex((item) => item.id === id)

  if (categoryIndex >= 0) {
    categories.splice(categoryIndex, 1)
  }

  res.status(204).send()
}
