import { create } from "zustand";

export interface DeleteState {
    visible: boolean,
    deleting: boolean,
    setVisible: (visible: boolean) => void,
    setDeleting: (deleting: boolean) => void
};

const useDeleteState = create<DeleteState>((set) => ({
    visible: false,
    deleting: false,
    setVisible: (visible) => set(() => ({
        visible: visible
    })),
    setDeleting: (deleting) => set(() => ({
        deleting: deleting
    }))
}));

export default useDeleteState;