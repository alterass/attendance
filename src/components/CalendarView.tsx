import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { db } from '../db';

interface CalendarViewProps {
  onDateClick?: (start: number, end: number) => void;
}

const typeColorMap: Record<string, string> = {
  加班: 'bg-amber-400',
  调休: 'bg-blue-400',
  请假: 'bg-emerald-400',
};

const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];

export function CalendarView({ onDateClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));

  const monthStart = currentMonth.startOf('month').valueOf();
  const monthEnd = currentMonth.endOf('month').valueOf();

  // 查询当月记录
  const records = useLiveQuery(async () => {
    return db.records
      .where('beginTime')
      .between(monthStart, monthEnd, true, true)
      .toArray();
  }, [monthStart, monthEnd]);

  // 构建日期→考勤类型映射
  const dateTypeMap = useMemo(() => {
    const map = new Map<number, Set<string>>();
    if (!records) return map;
    for (const r of records) {
      const dateKey = dayjs(r.beginTime).startOf('day').valueOf();
      if (!map.has(dateKey)) {
        map.set(dateKey, new Set());
      }
      map.get(dateKey)?.add(r.type);
    }
    return map;
  }, [records]);

  // 生成日历网格
  const calendarDays = useMemo(() => {
    const daysInMonth = currentMonth.daysInMonth();
    // dayjs().day() 周日=0，调整为周一=0
    const firstDayOfWeek = (currentMonth.day() + 6) % 7;
    const days: (number | null)[] = [];

    // 前置空位
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    // 有效日期
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [currentMonth]);

  const today = dayjs().startOf('day');

  const handlePrev = () => setCurrentMonth((m) => m.subtract(1, 'month'));
  const handleNext = () => setCurrentMonth((m) => m.add(1, 'month'));

  const handleDayClick = (day: number) => {
    const date = currentMonth.date(day);
    const start = date.startOf('day').valueOf();
    const end = date.endOf('day').valueOf();
    onDateClick?.(start, end);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* 月份切换 */}
      <div className="flex items-center justify-between mb-3">
        <Button
          icon={<IconChevronLeft />}
          theme="borderless"
          size="small"
          onClick={handlePrev}
        />
        <Typography.Title heading={5} className="mb-0!">
          {currentMonth.format('YYYY年M月')}
        </Typography.Title>
        <Button
          icon={<IconChevronRight />}
          theme="borderless"
          size="small"
          onClick={handleNext}
        />
      </div>

      {/* 星期头 */}
      <div className="grid grid-cols-7 mb-1">
        {weekHeaders.map((w) => (
          <div key={w} className="text-center text-xs text-gray-400 py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder for calendar grid alignment
            return <div key={`empty-${idx}`} className="h-10" />;
          }

          const dateKey = currentMonth.date(day).startOf('day').valueOf();
          const isToday = dateKey === today.valueOf();
          const types = dateTypeMap.get(dateKey);

          return (
            <button
              type="button"
              key={day}
              className={`flex flex-col items-center justify-center h-10 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${isToday ? 'bg-indigo-50 font-bold' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <span
                className={`text-sm ${isToday ? 'text-indigo-600' : types ? 'text-gray-800' : 'text-gray-400'}`}
              >
                {day}
              </span>
              {types && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from(types).map((type) => (
                    <span
                      key={type}
                      className={`w-1.5 h-1.5 rounded-full ${typeColorMap[type] || 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-gray-500">加班</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-500">调休</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-500">请假</span>
        </div>
      </div>
    </div>
  );
}
