import type { NextFunction, Request, Response } from 'express'
import type { AuthRole } from '../auth/jwt.js'
import { ForbiddenError, UnauthorizedError } from '../errors/AppError.js'

export function authorize(role: AuthRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError())
      return
    }

    if (req.user.role !== role) {
      next(new ForbiddenError())
      return
    }

    next()
  }
}
