import { useLiveQuery } from 'dexie-react-hooks';
import { useSnapshot } from 'valtio';
import { db } from '../db';
import { filterStore } from '../store/filter';

export function useFilteredRecords() {
  const { dateRange, type } = useSnapshot(filterStore);

  return useLiveQuery(async () => {
    let results = await db.records.orderBy('beginTime').reverse().toArray();

    if (dateRange) {
      const [start, end] = dateRange;
      results = results.filter(
        (r) => r.beginTime >= start && r.beginTime <= end,
      );
    }

    if (type) {
      results = results.filter((r) => r.type === type);
    }

    return results;
  }, [dateRange, type]);
}
