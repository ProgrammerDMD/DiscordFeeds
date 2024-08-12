"use client";

import { koulen } from "../Fonts";
import { cancelSubscription, resumeSubscription } from "@/app/utils/ServerActions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelResumeButton({ status }: {
    status: "active" | "canceled"
}) {
    const [isDisabled, setDisabled] = useState(false);
    const router = useRouter();

    const cancel = async () => {
        setDisabled(true);
        await cancelSubscription().then(() => {
            router.refresh();
        }).catch(() => {
            router.push("/dashboard/profile?event=cancel_error");
        });
        setDisabled(false);
    }

    const resume = async () => {
        setDisabled(true);
        await resumeSubscription().then(() => {
            setDisabled(false);
            router.refresh();
        }).catch(() => {
            router.push("/dashboard/profile?event=resume_error");
        });
        setDisabled(false);
    }

    if (status === "canceled") {
        return <button disabled={isDisabled} className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50"
            onClick={() => {
                resume();
            }}>
            <span className={`${koulen.className} text-white text-xl`}>Resume subscription</span>
        </button>
    } else {
        return <button disabled={isDisabled} className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50"
            onClick={() => {
                cancel();
            }}>
            <span className={`${koulen.className} text-white text-xl`}>Cancel subscription</span>
        </button>
    }
}