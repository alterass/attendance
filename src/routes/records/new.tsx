import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Typography } from '@douyinfe/semi-ui';
import { IconArrowLeft } from '@douyinfe/semi-icons';
import { Toast } from '@douyinfe/semi-ui';
import { RecordForm } from '../../components/RecordForm';
import { db } from '../../db';
import { appStore } from '../../store/app';
import type { AttendanceRecord } from '../../types';

export const Route = createFileRoute('/records/new')({
  component: NewRecordPage,
});

function NewRecordPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    type: AttendanceRecord['type'];
    desc: string;
    beginTime: number;
    overTime: number;
  }) => {
    try {
      const now = Date.now();
      const record: AttendanceRecord = {
        id: crypto.randomUUID(),
        type: values.type,
        desc: values.desc,
        beginTime: values.beginTime,
        overTime: values.overTime,
        createAt: now,
        updateAt: now,
      };

      await db.records.add(record);
      appStore.lastCreatedRecord = record;
      navigate({ to: '/records/success' });
    } catch (err) {
      Toast.error('新增失败');
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="page-header">
        <Button
          icon={<IconArrowLeft />}
          theme="borderless"
          onClick={() => navigate({ to: '/' })}
        />
        <Typography.Title heading={4} className="ml-2 !mb-0">
          新增考勤记录
        </Typography.Title>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/50">
        <RecordForm mode="create" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
