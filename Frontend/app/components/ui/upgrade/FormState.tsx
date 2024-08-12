import { create } from "zustand";
import { GuildPayment, User } from "../../backend/db/schema";

export interface FormState {
    visible: boolean,
    payment?: GuildPayment & {
        user?: User
    },
    showForm: ({ visible, payment }: {
        visible: boolean, payment?: GuildPayment & {
            user?: User
        }
    }) => void
};

const useFormStore = create<FormState>((set) => ({
    visible: false,
    payment: undefined,
    showForm: ({ visible, payment }) => set(() => ({
        visible: visible,
        payment: payment
    }))
}));

export default useFormStore;