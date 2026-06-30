import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useUser() {
  return useLiveQuery(async () => {
    const user = await db.user.toCollection().first();
    return user ?? null; // null 表示无用户，undefined 表示查询中
  });
}
