import { z } from 'zod'

const paginationNumberSchema = z.coerce
  .number({ error: 'O valor deve ser numerico.' })
  .int('O valor deve ser um numero inteiro.')
  .positive('O valor deve ser maior que zero.')

export const categoryQueryPaginationSchema = z.object({
  page: paginationNumberSchema.default(1),
  size: paginationNumberSchema.default(10),
})

export const categoryParamsSchema = z.object({
  id: z.uuid('O ID da categoria deve ser um UUID valido.'),
})

export const createCategorySchema = z.object({
  name: z.string().min(3, 'O nome da categoria deve ter pelo menos 3 caracteres.'),
})

export const updateCategorySchema = z.object({
  name: z.string().min(3, 'O nome da categoria deve ter pelo menos 3 caracteres.'),
})

export type CategoryQueryPagination = z.infer<typeof categoryQueryPaginationSchema>
export type CategoryParams = z.infer<typeof categoryParamsSchema>
export type CreateCategoryBody = z.infer<typeof createCategorySchema>
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>
