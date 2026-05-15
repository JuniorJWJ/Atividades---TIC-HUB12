import { createHmac, timingSafeEqual } from 'node:crypto'

export type AuthRole = 'admin' | 'customer'

export type JwtPayload = {
  sub: string
  role: AuthRole
}

const secret = process.env.JWT_SECRET ?? 'dev-secret'

function base64Url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function decodeBase64Url(input: string): string {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/')
  return Buffer.from(normalized, 'base64').toString('utf8')
}

function sign(data: string): string {
  return createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

export function createToken(payload: JwtPayload): string {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64Url(JSON.stringify(payload))
  const signature = sign(`${header}.${body}`)

  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): JwtPayload | null {
  const [header, body, signature] = token.split('.')

  if (!header || !body || !signature) {
    return null
  }

  const expectedSignature = sign(`${header}.${body}`)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  const payload = JSON.parse(decodeBase64Url(body)) as JwtPayload

  if (!payload.sub || (payload.role !== 'admin' && payload.role !== 'customer')) {
    return null
  }

  return payload
}
