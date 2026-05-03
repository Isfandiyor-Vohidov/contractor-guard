import { create } from 'zustand';
import type { AuditResult } from '@/types/audit';

interface AuditState {
  // Данные аудита
  status: 'pending' | 'processing' | 'success' | 'failed' | null;
  score: number | null;
  results: AuditResult[];
  
  // UI
  selectedResultId: string | null;
  
  // Действия
  setData: (data: {
    status?: AuditState['status'];
    score?: number | null;
    results?: AuditResult[];
  }) => void;
  setSelectedResultId: (id: string | null) => void;
  reset: () => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  status: null,
  score: null,
  results: [],
  selectedResultId: null,

  setData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  setSelectedResultId: (id) => set({ selectedResultId: id }),

  reset: () =>
    set({
      status: null,
      score: null,
      results: [],
      selectedResultId: null,
    }),
}));