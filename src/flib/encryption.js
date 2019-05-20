// @flow

import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = 'L3bcm%namc0g5ja43nkjfdsmv$fdsk$'

export const encrypt = (text: string) => {
  const cipher = crypto.createCipher(algorithm, key)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export const decrypt = (text: string) => {
  try {
    const decipher = crypto.createDecipher(algorithm, key)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    return ''
  }
}

const kUserAuthenticationTokenSeedPrefix = 'jdlkanrion3290£';

export function generateUserAuthenticationToken(userId: number): string {
  return encrypt(kUserAuthenticationTokenSeedPrefix + userId)
}

export function isUserAuthenticationToken(token: string): boolean {
  const tokenSeed = decrypt(token)
  return tokenSeed.substr(0, kUserAuthenticationTokenSeedPrefix.length)
    == kUserAuthenticationTokenSeedPrefix
}

export function getUserIdFromUserAuthenticationToken(token: string): ?number {
  if (!isUserAuthenticationToken(token)) {
    return null
  }
  const tokenSeed = decrypt(token)
  const userIdString = tokenSeed.substr(
    kUserAuthenticationTokenSeedPrefix.length,
    tokenSeed.length
  )
  const userId = parseInt(userIdString, 10)
  if (isNaN(userId)) {
    return null
  }
  return userId
}
