import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../auth/jwt.js'
import { UnauthorizedError } from '../errors/AppError.js'

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    next(new UnauthorizedError())
    return
  }

  const token = authorization.replace('Bearer ', '').trim()
  const payload = verifyToken(token)

  if (!payload) {
    next(new UnauthorizedError('Token invalido.'))
    return
  }

  req.user = {
    id: payload.sub,
    role: payload.role,
  }

  next()
}
