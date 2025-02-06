import { getCache, setCache, deleteCache } from "./cache";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getUser } from "@/data/db";

export async function createCacheSession(userId: string): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");

  await setCache(`session_${sessionId}`, String(userId), 86400);
  return sessionId;
}

export async function getCacheSession(
  sessionId: string
): Promise<string | null> {
  const userId = await getCache(`session_${sessionId}`);
  return userId ? userId : null;
}

export async function deleteCacheSession(sessionId: string) {
  await deleteCache(`session_${sessionId}`);
}

export async function getUserFromSession() {
  // const cookie = request.cookies.get("session_id");
  const cookie = (await cookies()).get("session_id")?.value;
  if (!cookie) {
    return null;
  }
  const userId = await getCacheSession(cookie);
  const user = await getUser({ id: Number(userId) });
  return user;
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session_id")?.value;
    if (!cookie) {
      return null;
    }
    await deleteCacheSession(cookie);
    cookieStore.delete("session_id");
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw error;
  }
}

export async function createSession(user_id: string) {
  // create session
  const cookieStore = await cookies();
  const session_id = await createCacheSession(user_id);
  if (!session_id) {
    throw new Error("session creation problem");
  }
  cookieStore.set("session_id", session_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
  });
}
