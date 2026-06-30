import { proxy } from 'valtio';
import type { AttendanceRecord } from '../types';

export const appStore = proxy({
  /** 新增成功后暂存的记录（用于成功页展示） */
  lastCreatedRecord: null as AttendanceRecord | null,
  /** 考勤申请预览的记录 ID 列表 */
  previewRecordIds: [] as string[],
});
