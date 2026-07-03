import { IconDownload } from '@douyinfe/semi-icons';
import { Button, Toast } from '@douyinfe/semi-ui';
import { exportAllData } from '../utils/export';

export function ExportButton() {
  const handleExport = async () => {
    try {
      await exportAllData();
      Toast.success('导出成功');
    } catch (err) {
      Toast.error(
        `导出失败：${err instanceof Error ? err.message : '未知错误'}`,
      );
    }
  };

  return (
    <Button
      icon={<IconDownload />}
      onClick={handleExport}
      style={{
        color: 'white',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 8,
      }}
    >
      导出
    </Button>
  );
}
