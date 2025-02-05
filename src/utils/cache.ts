import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.error("Redis client error", err);
});

(async () => {
  await client.connect();
})();

export const setCache = async (
  key: string,
  value: string,
  expirationInSeconds?: number
): Promise<void> => {
  if (expirationInSeconds) {
    await client.setEx(key, expirationInSeconds, value);
  } else {
    await client.set(key, value);
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  return await client.get(key);
};

export const deleteCache = async (key: string): Promise<void> => {
  await client.del(key);
};
