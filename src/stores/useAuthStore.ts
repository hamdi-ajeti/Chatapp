import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../types';
import { USERS } from '../data/mockData';

interface AuthState {
  currentUser: User;
  setStatus: (status: User['status']) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      currentUser: USERS[0], // "You" is always u1

      setStatus: (status) =>
        set((state) => ({
          currentUser: { ...state.currentUser, status },
        }), false, 'auth/setStatus'),
    }),
    { name: 'AuthStore' }
  )
);
