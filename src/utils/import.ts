import { db } from '../db';
import type { ExportData } from '../types';

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const data: ExportData = JSON.parse(text);

  if (!data.version || !data.user || !Array.isArray(data.records)) {
    throw new Error('无效的导入文件格式');
  }

  await db.transaction('rw', db.user, db.records, async () => {
    await db.user.clear();
    await db.records.clear();
    await db.user.add(data.user);
    if (data.records.length > 0) {
      await db.records.bulkAdd(data.records);
    }
  });
}
