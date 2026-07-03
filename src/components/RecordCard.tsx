import { Checkbox, Tag, Typography } from '@douyinfe/semi-ui';
import type { AttendanceRecord } from '../types';
import {
  calcHours,
  formatDate,
  formatTime,
  formatWeekday,
} from '../utils/time';

interface RecordCardProps {
  record: AttendanceRecord;
  selected: boolean;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

const typeStyleMap = {
  加班: { color: 'amber' as const, border: 'border-l-amber-400' },
  调休: { color: 'blue' as const, border: 'border-l-blue-400' },
  请假: { color: 'green' as const, border: 'border-l-emerald-400' },
};

export function RecordCard({
  record,
  selected,
  onToggle,
  onClick,
}: RecordCardProps) {
  const hours = calcHours(record.beginTime, record.overTime, record.type);
  const date = formatDate(record.beginTime);
  const begin = formatTime(record.beginTime);
  const over = formatTime(record.overTime);
  const style = typeStyleMap[record.type] || typeStyleMap.加班;

  return (
    // biome-ignore lint/a11y/useSemanticElements: card contains nested interactive elements, cannot use button
    <div
      role="button"
      tabIndex={0}
      className={`mb-3 bg-white rounded-xl border-l-4 ${style.border} shadow-sm cursor-pointer card-hover overflow-hidden ${selected ? 'ring-2 ring-indigo-300 ring-offset-1' : ''}`}
      onClick={() => onClick(record.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(record.id);
        }
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-pressed={selected}
          className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(record.id);
          }}
        >
          <Checkbox checked={selected} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Tag color={style.color} size="small" type="light">
              {record.type}
            </Tag>
            <Typography.Text strong size="small" className="text-gray-800!">
              {hours}h
            </Typography.Text>
          </div>
          <Typography.Text size="small" type="tertiary">
            {date} {formatWeekday(record.beginTime)} {begin} - {over}
          </Typography.Text>
          <Typography.Paragraph
            className="mb-0! mt-1 text-gray-600!"
            size="small"
            ellipsis
          >
            {record.desc}
          </Typography.Paragraph>
        </div>
        <div className="text-gray-300 shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <title>查看详情</title>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
