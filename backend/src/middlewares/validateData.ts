import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type RequestSource = 'body' | 'params' | 'query'

type ValidationErrorResponse = {
  message: string
  errors: string[]
}

export function validateData(schema: ZodType, source: RequestSource) {
  return (req: Request, res: Response<ValidationErrorResponse>, next: NextFunction): void => {
    const result = schema.safeParse(req[source])

    if (!result.success) {
      res.status(400).json({
        message: 'Erro de validação.',
        errors: result.error.issues.map((issue) => issue.message),
      })
      return
    }

    res.locals[source] = result.data
    next()
  }
}
