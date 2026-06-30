import Dexie, { type EntityTable } from 'dexie';
import type { AttendanceRecord, User } from '../types';

const db = new Dexie('AttendanceDB') as Dexie & {
  user: EntityTable<User, 'id'>;
  records: EntityTable<AttendanceRecord, 'id'>;
};

db.version(1).stores({
  user: '++id',
  records: 'id, type, beginTime, overTime, createAt',
});

export { db };
