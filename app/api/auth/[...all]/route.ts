import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/nextjs";

export const { GET, POST } = toNextJsHandler(auth);
