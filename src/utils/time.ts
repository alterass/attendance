import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const weekdayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 格式化日期: YYYY.MM-DD */
export function formatDate(ts: number): string {
  return dayjs(ts).format('YYYY.MM-DD');
}

/** 获取星期几: 周一~周日 */
export function formatWeekday(ts: number): string {
  return weekdayMap[dayjs(ts).day()];
}

/** 格式化时间: HH:mm */
export function formatTime(ts: number): string {
  return dayjs(ts).format('HH:mm');
}

/** 格式化日期时间: YYYY-MM-DD HH:mm */
export function formatDateTime(ts: number): string {
  return dayjs(ts).format('YYYY-MM-DD HH:mm');
}

/** 计算时长（小时，保留一位小数）
 * 调休/请假：结束时间超过 13:30 则扣除 1.5h 午休时间
 */
export function calcHours(
  beginTime: number,
  overTime: number,
  type?: '加班' | '调休' | '请假',
): number {
  let hours = (overTime - beginTime) / 3600000;

  if (type === '调休' || type === '请假') {
    const overHour = dayjs(overTime).hour();
    const overMinute = dayjs(overTime).minute();
    if (overHour > 13 || (overHour === 13 && overMinute >= 30)) {
      hours -= 1.5;
    }
  }

  return Math.round(Math.max(0, hours) * 10) / 10;
}
