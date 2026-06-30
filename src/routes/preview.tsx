import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, Spin, Toast, Typography } from '@douyinfe/semi-ui';
import { IconArrowLeft, IconCopy } from '@douyinfe/semi-icons';
import { useSnapshot } from 'valtio';
import { appStore } from '../store/app';
import {
  copyToClipboard,
  generateAttendanceText,
} from '../utils/attendance-text';

export const Route = createFileRoute('/preview')({
  component: PreviewPage,
});

function PreviewPage() {
  const navigate = useNavigate();
  const { previewRecordIds } = useSnapshot(appStore);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (previewRecordIds.length === 0) {
      navigate({ to: '/records' });
      return;
    }

    generateAttendanceText(previewRecordIds as string[])
      .then((t) => {
        setText(t);
        setLoading(false);
      })
      .catch(() => {
        Toast.error('生成预览失败');
        setLoading(false);
      });
  }, [previewRecordIds, navigate]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      Toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Toast.error('复制失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between page-header">
        <div className="flex items-center">
          <Button
            icon={<IconArrowLeft />}
            theme="borderless"
            onClick={() => navigate({ to: '/records' })}
          />
          <Typography.Title heading={4} className="ml-2 !mb-0">
            考勤申请预览
          </Typography.Title>
        </div>
        <Button
          type="primary"
          theme="solid"
          icon={<IconCopy />}
          onClick={handleCopy}
          style={{
            borderRadius: 10,
            background: copied
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
          }}
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
        <pre className="whitespace-pre-wrap text-sm leading-7 font-sans m-0 text-gray-700">
          {text}
        </pre>
      </div>
    </div>
  );
}
