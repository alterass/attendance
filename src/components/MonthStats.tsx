import { useLiveQuery } from 'dexie-react-hooks';
import dayjs from 'dayjs';
import { Typography } from '@douyinfe/semi-ui';
import { db } from '../db';
import { calcHours } from '../utils/time';

const statsConfig = [
  {
    label: '加班',
    key: 'overtime' as const,
    emoji: '🔥',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    label: '调休',
    key: 'off' as const,
    emoji: '☕',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: '请假',
    key: 'leave' as const,
    emoji: '🏖️',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
];

export function MonthStats() {
  const stats = useLiveQuery(async () => {
    const startOfMonth = dayjs().startOf('month').valueOf();
    const endOfMonth = dayjs().endOf('month').valueOf();

    const records = await db.records
      .where('beginTime')
      .between(startOfMonth, endOfMonth)
      .toArray();

    const result = { overtime: 0, off: 0, leave: 0 };
    for (const r of records) {
      const hours = calcHours(r.beginTime, r.overTime, r.type);
      if (r.type === '加班') result.overtime += hours;
      else if (r.type === '调休') result.off += hours;
      else result.leave += hours;
    }

    return {
      overtime: Math.round(result.overtime * 10) / 10,
      off: Math.round(result.off * 10) / 10,
      leave: Math.round(result.leave * 10) / 10,
    };
  });

  if (!stats) return null;

  const diff = Math.round((stats.overtime - stats.off) * 10) / 10;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {statsConfig.map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-2xl p-4 text-center transition-transform hover:scale-105`}
          >
            <div className="text-2xl mb-1">{item.emoji}</div>
            <Typography.Text type="tertiary" size="small" className="!text-xs">
              {item.label}
            </Typography.Text>
            <div className={`text-2xl font-bold mt-1 ${item.text}`}>
              {stats[item.key]}
              <span className="text-sm font-normal ml-0.5">h</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <Typography.Text type="tertiary" size="small">加班 - 调休</Typography.Text>
        </div>
        <div className={`text-2xl font-bold ${diff >= 0 ? 'text-purple-600' : 'text-red-500'}`}>
          {diff >= 0 ? '+' : ''}{diff}
          <span className="text-sm font-normal ml-0.5">h</span>
        </div>
      </div>
    </div>
  );
}
