"use client";

import Image from "next/image";
import useFormStore from "./FormState";
import { GuildPayment, User } from "../../backend/db/schema";

export default function UpgradeButton({
    payment,
    user
}: {
    payment: GuildPayment | undefined,
    user: User | undefined
}) {
    const { showForm } = useFormStore();

    return <button
        onClick={() => {

            if (!payment) {
                showForm({
                    visible: true,
                    payment: undefined
                });
            } else {
                showForm({
                    visible: true,
                    payment: {
                        ...payment,
                        user: user
                    }
                });
            }
        }}
        className="w-fit"
    >
        <div className="bg-blue bg-opacity-50 p-[0.625rem] rounded-full transition-shadow ease-out duration-[175ms] shadow hover:shadow-custom">
            <Image
                src="/images/upgrade.svg"
                width={40}
                height={40}
                alt="Upgrade Guild"
            />
        </div>
    </button>
};