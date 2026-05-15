import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/AppError.js'

type ErrorResponse = {
  message: string
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error instanceof Error) {
    res.status(400).json({ message: error.message })
    return
  }

  res.status(500).json({ message: 'Erro interno do servidor.' })
}
