import { useRef } from 'react';
import { Button, DatePicker, Form, Select, TextArea } from '@douyinfe/semi-ui';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import dayjs from 'dayjs';
import type { AttendanceRecord, RecordFormMode } from '../types';

interface RecordFormProps {
  mode: RecordFormMode;
  initialValues?: Partial<AttendanceRecord>;
  onSubmit?: (values: {
    type: AttendanceRecord['type'];
    desc: string;
    beginTime: number;
    overTime: number;
  }) => void;
  onEdit?: () => void;
}

/** 根据考勤类型获取默认起止时间 */
function getDefaultTimes(type: string): { beginTime: Date; overTime: Date } | null {
  const today = dayjs();
  if (type === '加班') {
    return {
      beginTime: today.hour(18).minute(30).second(0).toDate(),
      overTime: today.hour(20).minute(30).second(0).toDate(),
    };
  }
  if (type === '调休') {
    return {
      beginTime: today.hour(9).minute(0).second(0).toDate(),
      overTime: today.hour(18).minute(0).second(0).toDate(),
    };
  }
  return null;
}

export function RecordForm({
  mode,
  initialValues,
  onSubmit,
  onEdit,
}: RecordFormProps) {
  const disabled = mode === 'readonly';
  const formApiRef = useRef<FormApi>();
  const prevBeginRef = useRef<Date | null>(null);

  const handleSubmit = (values: Record<string, unknown>) => {
    const beginTime = values.beginTime as Date;
    const overTime = values.overTime as Date;
    const type = values.type as string;

    // 调休/请假：结束时间不能超过 18:00
    if (type === '调休' || type === '请假') {
      const h = dayjs(overTime).hour();
      const m = dayjs(overTime).minute();
      if (h > 18 || (h === 18 && m > 0)) {
        formApiRef.current?.setError('overTime', '调休/请假结束时间不能超过 18:00');
        return;
      }
    }

    onSubmit?.({
      type: type as AttendanceRecord['type'],
      desc: values.desc as string,
      beginTime: beginTime.getTime(),
      overTime: overTime.getTime(),
    });
  };

  const handleTypeChange = (value: string | number | (string | number)[] | undefined) => {
    if (mode !== 'create' || !value || !formApiRef.current) return;
    const defaults = getDefaultTimes(value as string);
    if (defaults) {
      formApiRef.current.setValue('beginTime', defaults.beginTime);
      formApiRef.current.setValue('overTime', defaults.overTime);
      prevBeginRef.current = defaults.beginTime;
    }
  };

  const getInitValues = () => {
    if (!initialValues) return {};
    if (initialValues.beginTime) {
      prevBeginRef.current = new Date(initialValues.beginTime);
    }
    return {
      type: initialValues.type,
      desc: initialValues.desc,
      beginTime: initialValues.beginTime
        ? new Date(initialValues.beginTime)
        : undefined,
      overTime: initialValues.overTime
        ? new Date(initialValues.overTime)
        : undefined,
    };
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initValues={getInitValues()}
      labelPosition="top"
      getFormApi={(api) => { formApiRef.current = api; }}
    >
      <Form.Select
        field="type"
        label="考勤类型"
        placeholder="请选择考勤类型"
        disabled={disabled}
        rules={[{ required: true, message: '请选择考勤类型' }]}
        style={{ width: '100%' }}
        onChange={handleTypeChange}
      >
        <Select.Option value="加班">加班</Select.Option>
        <Select.Option value="调休">调休</Select.Option>
        <Select.Option value="请假">请假</Select.Option>
      </Form.Select>

      <Form.DatePicker
        field="beginTime"
        label="起始时间"
        type="dateTime"
        placeholder="请选择起始时间"
        disabled={disabled}
        rules={[{ required: true, message: '请选择起始时间' }]}
        style={{ width: '100%' }}
        onChange={(date) => {
          if (!date || !formApiRef.current) return;
          const newBegin = date as Date;
          const currentOver = formApiRef.current.getValue('overTime') as Date | undefined;
          if (currentOver && prevBeginRef.current) {
            const diff = currentOver.getTime() - prevBeginRef.current.getTime();
            if (diff > 0) {
              formApiRef.current.setValue('overTime', new Date(newBegin.getTime() + diff));
            }
          }
          prevBeginRef.current = newBegin;
        }}
      />

      <Form.DatePicker
        field="overTime"
        label="结束时间"
        type="dateTime"
        placeholder="请选择结束时间"
        disabled={disabled}
        rules={[{ required: true, message: '请选择结束时间' }]}
        style={{ width: '100%' }}
      />

      <Form.TextArea
        field="desc"
        label="具体事由"
        placeholder="请输入具体事由"
        disabled={disabled}
        rules={[{ required: true, message: '请输入具体事由' }]}
        autosize
        rows={3}
      />

      {mode !== 'readonly' && (
        <div className="mt-8">
          <Button
            type="primary"
            htmlType="submit"
            theme="solid"
            block
            size="large"
            style={{
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
            }}
          >
            {mode === 'create' ? '提交' : '保存修改'}
          </Button>
        </div>
      )}

      {mode === 'readonly' && onEdit && (
        <div className="mt-8">
          <Button
            type="primary"
            theme="solid"
            block
            size="large"
            onClick={onEdit}
            style={{ height: 48, borderRadius: 12 }}
          >
            编辑
          </Button>
        </div>
      )}
    </Form>
  );
}

