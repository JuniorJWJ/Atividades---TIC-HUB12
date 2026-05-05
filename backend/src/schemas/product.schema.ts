import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3, 'O nome do produto deve ter pelo menos 3 caracteres.'),
  price: z.number('O preço deve ser numérico.').positive('O preço deve ser positivo.'),
  categoryId: z.uuid('O ID da categoria deve ser um UUID válido.'),
})

export const productQuerySchema = z.object({
  category: z.uuid('O filtro de categoria deve ser um UUID válido.').optional(),
})

export const productParamsSchema = z.object({
  id: z.uuid('O ID do produto deve ser um UUID válido.'),
})

export type CreateProductBody = z.infer<typeof createProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
export type ProductParams = z.infer<typeof productParamsSchema>
