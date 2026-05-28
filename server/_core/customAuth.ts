import type { Request } from "express";
import { verifyToken } from "../auth";
import * as db from "../db";

const OWNER_TOKEN_COOKIE = "owner_token";

/**
 * Authenticate a request using custom owner token (no OAuth)
 * Returns the owner if valid, null otherwise
 */
export async function authenticateOwnerRequest(req: Request): Promise<{ username: string } | null> {
  try {
    const cookies = req.headers.cookie || "";
    const cookieMap = new Map<string, string>();
    
    // Parse cookies manually
    cookies.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        cookieMap.set(key, decodeURIComponent(value));
      }
    });

    const token = cookieMap.get(OWNER_TOKEN_COOKIE);
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    return { username: decoded.username };
  } catch (error) {
    console.warn("[Auth] Custom auth failed:", String(error));
    return null;
  }
}

/**
 * Get the owner token from cookies
 */
export function getOwnerTokenFromRequest(req: Request): string | null {
  try {
    const cookies = req.headers.cookie || "";
    const cookieMap = new Map<string, string>();
    
    cookies.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        cookieMap.set(key, decodeURIComponent(value));
      }
    });

    return cookieMap.get(OWNER_TOKEN_COOKIE) || null;
  } catch (error) {
    return null;
  }
}
