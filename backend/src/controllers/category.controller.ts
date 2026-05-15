import type { NextFunction, Request, Response } from 'express'
import {
  CategoryListDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dtos/category.dto.js'
import { AppError } from '../errors/AppError.js'
import {
  categoryParamsSchema,
  categoryQueryPaginationSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../schemas/category.schema.js'
import type { CategoryService } from '../services/CategoryService.js'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const query = this.parse(categoryQueryPaginationSchema, req.query)
      const categories = this.categoryService.getAll(query.page, query.size)

      res.status(200).json(CategoryListDto.create(categories, query.page, query.size))
    } catch (error) {
      next(error)
    }
  }

  getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(categoryParamsSchema, req.params)
      const category = this.categoryService.getById(id)

      res.status(200).json(CategoryResponseDto.create(category))
    } catch (error) {
      next(error)
    }
  }

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const body = this.parse(createCategorySchema, req.body)
      const dto = CreateCategoryDto.create(body)
      const category = this.categoryService.create(dto.name)

      res.status(201).json(CategoryResponseDto.create(category))
    } catch (error) {
      next(error)
    }
  }

  update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(categoryParamsSchema, req.params)
      const body = this.parse(updateCategorySchema, req.body)
      const dto = UpdateCategoryDto.create(body)
      const category = this.categoryService.update(id, dto.name)

      res.status(200).json(CategoryResponseDto.create(category))
    } catch (error) {
      next(error)
    }
  }

  delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = this.parse(categoryParamsSchema, req.params)

      this.categoryService.delete(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  private parse<T>(schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } }, data: unknown): T {
    const result = schema.safeParse(data)

    if (!result.success) {
      throw new AppError(result.error.issues.map((issue) => issue.message).join(' | '), 400)
    }

    return result.data
  }
}
