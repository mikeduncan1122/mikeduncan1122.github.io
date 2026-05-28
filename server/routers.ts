import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getOwner, createOwner, getContent, updateContent, getSettings, updateSettings } from "./db";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "./auth";
import { TRPCError } from "@trpc/server";

// Owner login procedure
const ownerLoginProcedure = publicProcedure
  .input(z.object({ username: z.string(), password: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const owner = await getOwner(input.username);
    
    if (!owner) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    
    const isValid = await verifyPassword(input.password, owner.passwordHash);
    if (!isValid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    
    const token = generateToken(owner.username);
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie('owner_token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    return { success: true, token };
  });

// Owner logout procedure
const ownerLogoutProcedure = publicProcedure.mutation(({ ctx }) => {
  const cookieOptions = getSessionCookieOptions(ctx.req);
  ctx.res.clearCookie('owner_token', { ...cookieOptions, maxAge: -1 });
  return { success: true };
});

// Check owner auth status
const checkOwnerAuthProcedure = publicProcedure.query(({ ctx }) => {
  const token = ctx.req.cookies?.owner_token;
  if (!token) {
    return { isAuthenticated: false, username: null };
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return { isAuthenticated: false, username: null };
  }
  
  return { isAuthenticated: true, username: decoded.username };
});

// Admin procedures (require owner token)
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  const token = ctx.req.cookies?.owner_token;
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }
  
  return next({ ctx: { ...ctx, ownerUsername: decoded.username } });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  owner: router({
    login: ownerLoginProcedure,
    logout: ownerLogoutProcedure,
    checkAuth: checkOwnerAuthProcedure,
  }),

  admin: router({
    getContent: adminProcedure.query(async () => {
      const content = await getContent();
      return content || {
        id: 1,
        heroHeadline: 'Welcome to YouEnvy.me',
        heroSubheadline: 'Create your perfect online presence',
        heroDescription: 'Build and customize your website with ease',
        heroCTAText: 'Get Started',
        heroCTALink: '#',
        featuresTitle: 'Features',
        featuresDescription: 'Everything you need to succeed',
        ctaTitle: 'Ready to Get Started?',
        ctaDescription: 'Join thousands of satisfied users today',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

    updateContent: adminProcedure
      .input(z.object({
        heroHeadline: z.string().optional(),
        heroSubheadline: z.string().optional(),
        heroDescription: z.string().optional(),
        heroCTAText: z.string().optional(),
        heroCTALink: z.string().optional(),
        featuresTitle: z.string().optional(),
        featuresDescription: z.string().optional(),
        ctaTitle: z.string().optional(),
        ctaDescription: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateContent(input);
        return { success: true };
      }),

    getSettings: adminProcedure.query(async () => {
      const settings = await getSettings();
      return settings || {
        id: 1,
        primaryColor: '#3b82f6',
        secondaryColor: '#1f2937',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'sans-serif',
        backgroundStyle: 'solid',
        backgroundGradient: null,
        showHero: true,
        showFeatures: true,
        showCTA: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

    updateSettings: adminProcedure
      .input(z.object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        fontFamily: z.string().optional(),
        backgroundStyle: z.string().optional(),
        backgroundGradient: z.string().optional(),
        showHero: z.boolean().optional(),
        showFeatures: z.boolean().optional(),
        showCTA: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateSettings(input);
        return { success: true };
      }),
  }),

  public: router({
    getContent: publicProcedure.query(async () => {
      const content = await getContent();
      return content || {
        id: 1,
        heroHeadline: 'Welcome to YouEnvy.me',
        heroSubheadline: 'Create your perfect online presence',
        heroDescription: 'Build and customize your website with ease',
        heroCTAText: 'Get Started',
        heroCTALink: '#',
        featuresTitle: 'Features',
        featuresDescription: 'Everything you need to succeed',
        ctaTitle: 'Ready to Get Started?',
        ctaDescription: 'Join thousands of satisfied users today',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

    getSettings: publicProcedure.query(async () => {
      const settings = await getSettings();
      return settings || {
        id: 1,
        primaryColor: '#3b82f6',
        secondaryColor: '#1f2937',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'sans-serif',
        backgroundStyle: 'solid',
        backgroundGradient: null,
        showHero: true,
        showFeatures: true,
        showCTA: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
