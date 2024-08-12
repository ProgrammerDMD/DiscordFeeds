import { FeedResponse } from "@/types/APITypes";
import { create } from "zustand";

export interface FormState {
    visible: boolean,
    options?: FeedResponse,
    showForm: ({ visible, options }: { visible: boolean, options?: FeedResponse }) => void
};

const useFormStore = create<FormState>((set) => ({
    visible: false,
    options: undefined,
    showForm: ({ visible, options }) => set(() => ({
        visible: visible,
        options: options
    }))
}));

export default useFormStore;