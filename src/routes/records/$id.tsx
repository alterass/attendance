import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { Button, Spin, Typography } from '@douyinfe/semi-ui';
import { IconArrowLeft } from '@douyinfe/semi-icons';
import { Toast } from '@douyinfe/semi-ui';
import { RecordForm } from '../../components/RecordForm';
import { db } from '../../db';
import type { AttendanceRecord, RecordFormMode } from '../../types';

export const Route = createFileRoute('/records/$id')({
  component: RecordDetailPage,
});

function RecordDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<RecordFormMode>('readonly');

  const record = useLiveQuery(() => db.records.get(id), [id]);

  if (record === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">🔍</div>
        <Typography.Title heading={5} type="tertiary" className="!mb-3">
          记录不存在
        </Typography.Title>
        <Button
          onClick={() => navigate({ to: '/records' })}
          style={{ borderRadius: 10 }}
        >
          返回列表
        </Button>
      </div>
    );
  }

  const handleSubmit = async (values: {
    type: AttendanceRecord['type'];
    desc: string;
    beginTime: number;
    overTime: number;
  }) => {
    try {
      await db.records.update(id, {
        ...values,
        updateAt: Date.now(),
      });
      Toast.success('修改成功');
      setMode('readonly');
    } catch (err) {
      Toast.error('修改失败');
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="page-header">
        <Button
          icon={<IconArrowLeft />}
          theme="borderless"
          onClick={() => navigate({ to: '/records' })}
        />
        <Typography.Title heading={4} className="ml-2 !mb-0">
          {mode === 'readonly' ? '记录详情' : '编辑记录'}
        </Typography.Title>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50">
        <RecordForm
          mode={mode}
          initialValues={record}
          onSubmit={handleSubmit}
          onEdit={() => setMode('edit')}
        />
      </div>
    </div>
  );
}
