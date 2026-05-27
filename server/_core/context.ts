import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { authenticateOwnerRequest } from "./customAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  owner: { username: string } | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let owner: { username: string } | null = null;

  try {
    owner = await authenticateOwnerRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    owner = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user: null, // Legacy OAuth user - no longer used
    owner,
  };
}
