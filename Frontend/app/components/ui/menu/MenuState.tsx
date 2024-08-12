import { create } from "zustand";

export interface MenuState {
    visible: boolean,
    setVisible: (visible: boolean) => void
};

const useMenuState = create<MenuState>((set) => ({
    visible: false,
    setVisible: (visible) => set(() => ({
        visible: visible
    }))
}));

export default useMenuState;