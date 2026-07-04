import { IconList, IconPlus } from '@douyinfe/semi-icons';
import { Button, Space, Typography } from '@douyinfe/semi-ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CalendarView } from '../components/CalendarView';
import { ExportButton } from '../components/ExportButton';
import { MonthStats } from '../components/MonthStats';
import { useUser } from '../hooks/useUser';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const user = useUser();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pt-6">
      {/* 顶部问候 */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <Typography.Text className="text-white/70! text-sm!">
              {dayjs().format('YYYY年M月D日 dddd')}
            </Typography.Text>
            <Typography.Title heading={3} className="text-white! mt-1! mb-1!">
              你好，{user.name} 👋
            </Typography.Title>
            <Typography.Text className="text-white/60! text-xs!">
              {user.department}
            </Typography.Text>
          </div>
          <ExportButton />
        </div>
      </div>

      {/* 当月统计 */}
      <div className="mb-6">
        <Typography.Title heading={5} className="mb-3! text-gray-700!">
          {currentMonth.format('M月')}统计
        </Typography.Title>
        <MonthStats month={currentMonth} />
      </div>

      {/* 日历视图 */}
      <div className="mb-6">
        <Typography.Title heading={5} className="mb-3! text-gray-700!">
          考勤日历
        </Typography.Title>
        <CalendarView
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDateClick={(start, end) => {
            navigate({ to: '/records', search: { from: start, to: end } });
          }}
        />
      </div>

      {/* 操作按钮 */}
      <div className="mt-8">
        <Space vertical style={{ width: '100%' }} spacing={12}>
          <Button
            type="primary"
            theme="solid"
            size="large"
            block
            icon={<IconPlus />}
            onClick={() => navigate({ to: '/records/new' })}
            style={{
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              fontSize: 16,
            }}
          >
            新增考勤记录
          </Button>
          <Button
            size="large"
            block
            icon={<IconList />}
            onClick={() => navigate({ to: '/records' })}
            style={{
              height: 52,
              borderRadius: 14,
              fontSize: 16,
              background: 'white',
              border: '1px solid #e5e7eb',
            }}
          >
            查看考勤记录
          </Button>
        </Space>
      </div>
    </div>
  );
}
