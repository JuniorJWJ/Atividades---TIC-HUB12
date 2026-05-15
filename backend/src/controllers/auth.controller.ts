import type { Request, Response } from 'express'
import { createToken } from '../auth/jwt.js'

export function login(req: Request, res: Response): void {
  const role = req.body?.role === 'admin' ? 'admin' : 'customer'
  const token = createToken({
    sub: role === 'admin' ? 'admin-user' : 'customer-user',
    role,
  })

  res.status(200).json({ token, role })
}
