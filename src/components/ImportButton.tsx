import { IconUpload } from '@douyinfe/semi-icons';
import { Button, Toast } from '@douyinfe/semi-ui';
import { useRef } from 'react';
import { importData } from '../utils/import';

interface ImportButtonProps {
  onSuccess?: () => void;
}

export function ImportButton({ onSuccess }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      Toast.success('导入成功');
      onSuccess?.();
    } catch (err) {
      Toast.error(
        `导入失败：${err instanceof Error ? err.message : '未知错误'}`,
      );
    }

    // 清空 input 使同一文件可再次选择
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Button icon={<IconUpload />} onClick={handleClick}>
        导入数据
      </Button>
    </>
  );
}
