import { create } from "zustand";

interface SubscriptionState {
    visible: boolean,
    setVisible: (value: boolean) => void
}

const useSubscriptionStore = create<SubscriptionState>((set) => ({
    visible: false,
    setVisible: (value: boolean) => set(() => ({
        visible: value
    }))
}));

export default useSubscriptionStore;