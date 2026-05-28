import crypto from 'crypto';

// Simple password hashing using crypto (since bcrypt requires native modules)
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, originalHash] = hash.split(':');
  const newHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return newHash === originalHash;
}

// Generate JWT token
export function generateToken(ownerUsername: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ 
    username: ownerUsername,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  })).toString('base64url');
  
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  
  return `${header}.${payload}.${signature}`;
}

// Verify JWT token
export function verifyToken(token: string): { username: string } | null {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    
    if (signatureB64 !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { username: payload.username };
  } catch (error) {
    return null;
  }
}
