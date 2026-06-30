import dayjs from 'dayjs';
import { db } from '../db';
import type { AttendanceRecord } from '../types';
import { calcHours, formatDate, formatTime } from './time';

/**
 * 生成单条记录文本
 */
function formatRecord(record: AttendanceRecord): string {
  const date = formatDate(record.beginTime);
  const begin = formatTime(record.beginTime);
  const over = formatTime(record.overTime);
  const hours = calcHours(record.beginTime, record.overTime, record.type);

  return [
    `日期与时间：${date}  ${begin} - ${over}`,
    `考勤类型：${record.type} ${hours}h`,
    `具体事由：${record.desc}`,
  ].join('\n');
}

/**
 * 生成完整考勤申请文本
 */
export async function generateAttendanceText(
  recordIds: string[],
): Promise<string> {
  const user = await db.user.toCollection().first();
  if (!user) throw new Error('用户信息不存在');

  const records = await db.records
    .where('id')
    .anyOf(recordIds)
    .sortBy('beginTime');

  const header = `姓名：${user.name}\n部门：${user.department}`;
  const body = records.map(formatRecord).join('\n\n');

  return `${header}\n\n${body}`;
}

/**
 * 获取本周记录 ID
 */
export async function getThisWeekRecordIds(): Promise<string[]> {
  const start = dayjs().startOf('week').valueOf();
  const end = dayjs().endOf('week').valueOf();
  const records = await db.records
    .where('beginTime')
    .between(start, end)
    .toArray();
  return records.map((r) => r.id);
}

/**
 * 获取上周记录 ID
 */
export async function getLastWeekRecordIds(): Promise<string[]> {
  const start = dayjs().subtract(1, 'week').startOf('week').valueOf();
  const end = dayjs().subtract(1, 'week').endOf('week').valueOf();
  const records = await db.records
    .where('beginTime')
    .between(start, end)
    .toArray();
  return records.map((r) => r.id);
}

/**
 * 获取本月记录 ID
 */
export async function getThisMonthRecordIds(): Promise<string[]> {
  const start = dayjs().startOf('month').valueOf();
  const end = dayjs().endOf('month').valueOf();
  const records = await db.records
    .where('beginTime')
    .between(start, end)
    .toArray();
  return records.map((r) => r.id);
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
