import { proxy } from 'valtio';

export const filterStore = proxy({
  dateRange: null as [number, number] | null,
  type: null as '加班' | '调休' | '请假' | null,
  selectedIds: {} as Record<string, boolean>,
});

export function toggleSelect(id: string) {
  if (filterStore.selectedIds[id]) {
    delete filterStore.selectedIds[id];
  } else {
    filterStore.selectedIds[id] = true;
  }
}

export function clearSelection() {
  filterStore.selectedIds = {};
}

export function selectAll(ids: string[]) {
  for (const id of ids) {
    filterStore.selectedIds[id] = true;
  }
}

export function getSelectedIdsList(): string[] {
  return Object.keys(filterStore.selectedIds);
}

export function getSelectedCount(): number {
  return Object.keys(filterStore.selectedIds).length;
}
