import dayjs from 'dayjs';
import type { AttendanceRecord } from '../types';

/**
 * 解析考勤申请文本，生成考勤记录数组
 * 支持格式：
 * 日期与时间：2026.06-02  18:30 - 21:30
 * 考勤类型：加班 3h
 * 具体事由：陈列需求评审
 */
export function parseAttendanceText(
  text: string,
): Omit<AttendanceRecord, 'id' | 'createAt' | 'updateAt'>[] {
  const records: Omit<AttendanceRecord, 'id' | 'createAt' | 'updateAt'>[] = [];

  // 按空行分块
  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .trim()
      .split('\n')
      .map((l) => l.trim());

    let dateLine = '';
    let typeLine = '';
    let descLine = '';

    for (const line of lines) {
      if (line.startsWith('日期与时间')) {
        dateLine = line;
      } else if (line.startsWith('考勤类型')) {
        typeLine = line;
      } else if (line.startsWith('具体事由')) {
        descLine = line;
      }
    }

    // 跳过不完整的块（如姓名/部门行）
    if (!dateLine || !typeLine) continue;

    // 解析日期与时间：2026.06-02  18:30 - 21:30
    const dateMatch = dateLine.match(
      /(\d{4})\.(\d{2})-(\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/,
    );
    if (!dateMatch) continue;

    const [, year, month, day, beginTimeStr, overTimeStr] = dateMatch;
    const dateStr = `${year}-${month}-${day}`;

    const beginTime = dayjs(`${dateStr} ${beginTimeStr}`).valueOf();
    const overTime = dayjs(`${dateStr} ${overTimeStr}`).valueOf();

    if (!beginTime || !overTime) continue;

    // 解析考勤类型：加班 3h
    const typeMatch = typeLine.match(/考勤类型[：:]\s*(加班|调休|请假)/);
    if (!typeMatch) continue;
    const type = typeMatch[1] as '加班' | '调休' | '请假';

    // 解析具体事由
    const desc = descLine.replace(/具体事由[：:]\s*/, '').trim() || type;

    records.push({ type, desc, beginTime, overTime });
  }

  return records;
}
