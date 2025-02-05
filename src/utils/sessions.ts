import { NextRequest } from "next/server";
import { getCache, setCache, deleteCache } from "./cache";
import { randomBytes } from "crypto";

export async function createSession(userId: string): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");

  await setCache(`session_${sessionId}`, String(userId), 86400);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<string | null> {
  const userId = await getCache(`session_${sessionId}`);
  return userId ? userId : null;
}

export async function deleteSession(sessionId: string) {
  await deleteCache(`session_${sessionId}`);
}

export async function getUserFromSession(request: NextRequest) {
  const cookie = request.cookies.get("session_id");
  if (!cookie) {
    return null;
  }
  const userId = await getSession(cookie.value);
  return userId;
}
