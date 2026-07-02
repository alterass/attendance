import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, DatePicker, Dropdown, Modal, Select, TextArea, Toast, Typography } from '@douyinfe/semi-ui';
import { IconArrowLeft, IconImport, IconPlus } from '@douyinfe/semi-icons';
import { useSnapshot } from 'valtio';
import { useFilteredRecords } from '../../hooks/useRecords';
import { filterStore, toggleSelect, clearSelection, getSelectedIdsList, getSelectedCount } from '../../store/filter';
import { appStore } from '../../store/app';
import { RecordCard } from '../../components/RecordCard';
import {
  getLastWeekRecordIds,
  getThisMonthRecordIds,
  getThisWeekRecordIds,
} from '../../utils/attendance-text';
import { parseAttendanceText } from '../../utils/parse-text';
import { db } from '../../db';
import type { AttendanceRecord } from '../../types';
import dayjs from 'dayjs';

export const Route = createFileRoute('/records/')({
  component: RecordsListPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: typeof search.from === 'number' ? search.from : undefined,
      to: typeof search.to === 'number' ? search.to : undefined,
    };
  },
});

function RecordsListPage() {
  const navigate = useNavigate();
  const { from, to } = Route.useSearch();
  const records = useFilteredRecords();
  const { selectedIds, dateRange } = useSnapshot(filterStore);
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState('');

  // 从路由参数初始化 dateRange
  useEffect(() => {
    if (from && to) {
      filterStore.dateRange = [from, to];
    } else {
      filterStore.dateRange = null;
    }
  }, [from, to]);

  const handleImport = async () => {
    if (!importText.trim()) {
      Toast.warning('请粘贴考勤申请文本');
      return;
    }
    try {
      const parsed = parseAttendanceText(importText);
      if (parsed.length === 0) {
        Toast.error('未能解析出有效记录，请检查文本格式');
        return;
      }
      const now = Date.now();
      const newRecords: AttendanceRecord[] = parsed.map((r) => ({
        ...r,
        id: crypto.randomUUID(),
        createAt: now,
        updateAt: now,
      }));
      await db.records.bulkAdd(newRecords);
      Toast.success(`成功导入 ${newRecords.length} 条记录`);
      setImportVisible(false);
      setImportText('');
    } catch (err) {
      Toast.error('导入失败，请检查文本格式');
    }
  };

  const handleGenerate = async (key: string) => {
    let ids: string[] = [];

    switch (key) {
      case 'selected':
        ids = getSelectedIdsList();
        break;
      case 'month':
        ids = await getThisMonthRecordIds();
        break;
      case 'week':
        ids = await getThisWeekRecordIds();
        break;
      case 'lastWeek':
        ids = await getLastWeekRecordIds();
        break;
    }

    if (ids.length === 0) {
      return;
    }

    appStore.previewRecordIds = ids;
    clearSelection();
    navigate({ to: '/preview' });
  };

  const handleDateRangeChange = (
    dates: Date[] | Date | string | string[] | undefined,
  ) => {
    if (Array.isArray(dates) && dates.length === 2 && dates[0] instanceof Date) {
      filterStore.dateRange = [
        dayjs(dates[0]).startOf('day').valueOf(),
        dayjs(dates[1]).endOf('day').valueOf(),
      ];
    } else {
      filterStore.dateRange = null;
    }
  };

  const handleTypeChange = (value: string | number | (string | number)[] | undefined) => {
    filterStore.type = (value as '加班' | '调休' | '请假') || null;
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-24">
      {/* 顶部导航 */}
      <div className="page-header">
        <Button
          icon={<IconArrowLeft />}
          theme="borderless"
          onClick={() => navigate({ to: '/' })}
        />
        <Typography.Title heading={4} className="ml-2 !mb-0">
          考勤记录
        </Typography.Title>
      </div>

      {/* 筛选栏 */}
      <div className="flex gap-2 mb-4 bg-white/60 backdrop-blur-sm rounded-xl p-3">
        <DatePicker
          type="dateRange"
          placeholder={['开始日期', '结束日期']}
          value={dateRange ? [new Date(dateRange[0]), new Date(dateRange[1])] : undefined}
          onChange={handleDateRangeChange}
          density="compact"
          style={{ flex: 1 }}
        />
        <Select
          placeholder="类型"
          onChange={handleTypeChange}
          showClear
          style={{ width: 100 }}
        >
          <Select.Option value="加班">加班</Select.Option>
          <Select.Option value="调休">调休</Select.Option>
          <Select.Option value="请假">请假</Select.Option>
        </Select>
      </div>

      {/* 记录列表 */}
      {records && records.length > 0 ? (
        records.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            selected={!!selectedIds[record.id]}
            onToggle={toggleSelect}
            onClick={(id) => navigate({ to: '/records/$id', params: { id } })}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <Typography.Title heading={5} type="tertiary">
            暂无记录
          </Typography.Title>
          <Typography.Text type="tertiary" size="small">
            点击下方按钮新增考勤记录
          </Typography.Text>
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="bottom-bar">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            type="primary"
            theme="solid"
            icon={<IconPlus />}
            onClick={() => navigate({ to: '/records/new' })}
            style={{
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
            }}
          >
            新增
          </Button>
          <Button
            icon={<IconImport />}
            onClick={() => setImportVisible(true)}
            style={{ borderRadius: 10 }}
          >
            从历史导入
          </Button>
          <Dropdown
            trigger="click"
            position="topLeft"
            menu={[
              {
                node: 'item',
                name: '勾选的记录',
                onClick: () => handleGenerate('selected'),
                disabled: getSelectedCount() === 0,
              },
              {
                node: 'item',
                name: '本月',
                onClick: () => handleGenerate('month'),
              },
              {
                node: 'item',
                name: '本周',
                onClick: () => handleGenerate('week'),
              },
              {
                node: 'item',
                name: '上周',
                onClick: () => handleGenerate('lastWeek'),
              },
            ]}
          >
            <Button style={{ borderRadius: 10 }}>生成申请</Button>
          </Dropdown>
        </div>
      </div>

      {/* 从历史导入弹窗 */}
      <Modal
        title="从历史导入"
        visible={importVisible}
        onOk={handleImport}
        onCancel={() => { setImportVisible(false); setImportText(''); }}
        okText="导入"
        cancelText="取消"
        style={{ maxWidth: 480 }}
      >
        <Typography.Text type="tertiary" size="small" className="block mb-3">
          粘贴考勤申请文本，系统会自动解析并生成记录
        </Typography.Text>
        <TextArea
          value={importText}
          onChange={(v) => setImportText(v)}
          placeholder={'日期与时间：2026.06-02  18:30 - 21:30\n考勤类型：加班 3h\n具体事由：需求评审'}
          autosize={{ minRows: 8, maxRows: 16 }}
        />
      </Modal>
    </div>
  );
}
