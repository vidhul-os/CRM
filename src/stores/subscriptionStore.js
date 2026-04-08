import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSubscriptionStore = create(
  persist(
    (set) => ({
      selectedPlan: null,
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      clearSelectedPlan: () => set({ selectedPlan: null }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);
