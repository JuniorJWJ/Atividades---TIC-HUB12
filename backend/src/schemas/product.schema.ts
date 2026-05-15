import { z } from 'zod'

const paginationNumberSchema = z.coerce
  .number({ error: 'O valor deve ser numerico.' })
  .int('O valor deve ser um numero inteiro.')
  .positive('O valor deve ser maior que zero.')

export const productQuerySchema = z.object({
  page: paginationNumberSchema.default(1),
  size: paginationNumberSchema.default(10),
  category: z.uuid('O filtro de categoria deve ser um UUID valido.').optional(),
})

export const productParamsSchema = z.object({
  id: z.uuid('O ID do produto deve ser um UUID valido.'),
})

export const createProductSchema = z.object({
  name: z.string().min(3, 'O nome do produto deve ter pelo menos 3 caracteres.'),
  price: z.number({ error: 'O preco deve ser numerico.' }).positive('O preco deve ser positivo.'),
  stock: z
    .number({ error: 'O estoque deve ser numerico.' })
    .int('O estoque deve ser um numero inteiro.')
    .nonnegative('O estoque nao pode ser negativo.'),
  categoryId: z.uuid('O ID da categoria deve ser um UUID valido.'),
})

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Informe pelo menos um campo para atualizar.',
)

export type ProductQuery = z.infer<typeof productQuerySchema>
export type ProductParams = z.infer<typeof productParamsSchema>
export type CreateProductBody = z.infer<typeof createProductSchema>
export type UpdateProductBody = z.infer<typeof updateProductSchema>
