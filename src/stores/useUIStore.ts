import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ModalType =
  | { type: 'create-server' }
  | { type: 'create-channel'; serverId: string }
  | { type: 'edit-channel'; serverId: string; channelId: string }
  | null;

interface UIState {
  modal: ModalType;
  openModal: (modal: NonNullable<ModalType>) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      modal: null,
      openModal: (modal) => set({ modal }, false, 'ui/openModal'),
      closeModal: () => set({ modal: null }, false, 'ui/closeModal'),
    }),
    { name: 'UIStore' }
  )
);