import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Descriptions, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { useSnapshot } from 'valtio';
import { appStore } from '../../store/app';
import { formatDateTime, calcHours } from '../../utils/time';

export const Route = createFileRoute('/records/success')({
  component: RecordSuccessPage,
});

function RecordSuccessPage() {
  const navigate = useNavigate();
  const { lastCreatedRecord } = useSnapshot(appStore);

  if (!lastCreatedRecord) {
    navigate({ to: '/' });
    return null;
  }

  const hours = calcHours(lastCreatedRecord.beginTime, lastCreatedRecord.overTime, lastCreatedRecord.type);

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center justify-center">
      {/* 成功图标 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-4">
          <span className="text-5xl">✅</span>
        </div>
        <Typography.Title heading={2} className="!mb-1">
          新增成功
        </Typography.Title>
        <Typography.Text type="tertiary">
          考勤记录已保存
        </Typography.Text>
      </div>

      {/* 记录详情卡片 */}
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-8 border border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Tag size="large" color={lastCreatedRecord.type === '加班' ? 'amber' : lastCreatedRecord.type === '调休' ? 'blue' : 'green'} type="light">
            {lastCreatedRecord.type}
          </Tag>
          <Typography.Title heading={4} className="!mb-0">
            {hours}h
          </Typography.Title>
        </div>
        <Descriptions
          data={[
            {
              key: '起始时间',
              value: formatDateTime(lastCreatedRecord.beginTime),
            },
            {
              key: '结束时间',
              value: formatDateTime(lastCreatedRecord.overTime),
            },
            { key: '具体事由', value: lastCreatedRecord.desc },
          ]}
          row
          size="medium"
        />
      </div>

      {/* 操作按钮 */}
      <Space style={{ width: '100%' }} spacing={12}>
        <Button
          size="large"
          block
          onClick={() => navigate({ to: '/' })}
          style={{ height: 48, borderRadius: 12, background: 'white', border: '1px solid #e5e7eb' }}
        >
          返回首页
        </Button>
        <Button
          type="primary"
          theme="solid"
          size="large"
          block
          onClick={() => navigate({ to: '/records/new' })}
          style={{
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
          }}
        >
          继续新增
        </Button>
      </Space>
    </div>
  );
}
