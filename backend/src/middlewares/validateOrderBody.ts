import type { NextFunction, Request, Response } from 'express'

type ErrorResponse = {
  message: string
}

export function validateOrderBody(req: Request, res: Response<ErrorResponse>, next: NextFunction): void {
  const body = req.body as Record<string, unknown> | undefined

  if (!body || Object.keys(body).length === 0) {
    res.status(400).json({ message: 'O corpo da requisição não pode estar vazio.' })
    return
  }

  next()
}
