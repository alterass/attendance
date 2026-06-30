export interface User {
  id?: number;
  /** 姓名 */
  name: string;
  /** 部门 */
  department: string;
  /** 可调休时长（小时） */
  offHour: number;
}

export interface AttendanceRecord {
  /** primary id */
  id: string;
  /** 考勤类型 */
  type: '加班' | '调休' | '请假';
  /** 具体事由 */
  desc: string;
  /** 起始时间（ms 时间戳） */
  beginTime: number;
  /** 结束时间（ms 时间戳） */
  overTime: number;
  /** 创建时间 */
  createAt: number;
  /** 更新时间 */
  updateAt: number;
}

export type RecordFormMode = 'create' | 'edit' | 'readonly';

export interface ExportData {
  version: 1;
  exportAt: number;
  user: User;
  records: AttendanceRecord[];
}
