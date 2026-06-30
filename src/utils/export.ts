import { db } from '../db';
import type { ExportData } from '../types';

export async function exportAllData(): Promise<void> {
  const user = await db.user.toCollection().first();
  const records = await db.records.toArray();

  if (!user) throw new Error('未找到用户数据');

  const data: ExportData = {
    version: 1,
    exportAt: Date.now(),
    user: { name: user.name, department: user.department, offHour: user.offHour },
    records,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
