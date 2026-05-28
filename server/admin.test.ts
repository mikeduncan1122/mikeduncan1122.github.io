import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';
import type { TrpcContext } from './_core/context';

describe('Authentication', () => {
  it('should hash and verify passwords correctly', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    expect(hash).toContain(':');
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect passwords', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword('wrongPassword', hash);
    expect(isValid).toBe(false);
  });

  it('should generate and verify JWT tokens', () => {
    const username = 'testuser';
    const token = generateToken(username);
    
    expect(token).toBeTruthy();
    expect(token.split('.').length).toBe(3);
    
    const decoded = verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded?.username).toBe(username);
  });

  it('should reject invalid tokens', () => {
    const invalidToken = 'invalid.token.here';
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });

  it('should reject expired tokens', () => {
    // Create a token with past expiration
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ 
      username: 'testuser',
      iat: Math.floor(Date.now() / 1000) - 10000,
      exp: Math.floor(Date.now() / 1000) - 1000 // Expired 1000 seconds ago
    })).toString('base64url');
    
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const signature = require('crypto')
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');
    
    const expiredToken = `${header}.${payload}.${signature}`;
    const decoded = verifyToken(expiredToken);
    expect(decoded).toBeNull();
  });
});

describe('Admin Procedures', () => {
  it('should require authentication for admin procedures', async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
        cookies: {},
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.admin.getContent();
      expect.fail('Should have thrown UNAUTHORIZED error');
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
    }
  });

  it('should allow authenticated admin to get content', async () => {
    const token = generateToken('admin');
    
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
        cookies: { owner_token: token },
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    const content = await caller.admin.getContent();
    
    expect(content).toBeTruthy();
    expect(content.heroHeadline).toBeTruthy();
  });

  it('should allow authenticated admin to get settings', async () => {
    const token = generateToken('admin');
    
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
        cookies: { owner_token: token },
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    const settings = await caller.admin.getSettings();
    
    expect(settings).toBeTruthy();
    expect(settings.primaryColor).toBeTruthy();
    expect(settings.backgroundColor).toBeTruthy();
  });
});

describe('Public Procedures', () => {
  it('should allow public access to content', async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
        cookies: {},
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    const content = await caller.public.getContent();
    
    expect(content).toBeTruthy();
    expect(content.heroHeadline).toBeTruthy();
  });

  it('should allow public access to settings', async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
        cookies: {},
      } as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(ctx);
    const settings = await caller.public.getSettings();
    
    expect(settings).toBeTruthy();
    expect(settings.primaryColor).toBeTruthy();
  });
});
