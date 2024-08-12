"use client";
import { useState } from "react";
import { koulen } from "../Fonts";
import { cancelUserDeletionDB } from "@/app/utils/ServerActions";
import { useRouter } from "next/navigation";

export default function CancelDeleteButton() {
    const [canceling, setCanceling] = useState(false);
    const router = useRouter();
    const cancelDeletion = async () => {
        setCanceling(true);
        const response = await cancelUserDeletionDB();
        setCanceling(false);
        if (response && response.message) {
            router.push("/dashboard/profile?event=cancel_delete_error");
        } else {
            router.refresh();
        }
    }

    return <button disabled={canceling} onClick={() => cancelDeletion()} className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 disabled:bg-opacity-80">
        <span className={`${koulen.className} text-white text-[2.5em]`}>Cancel Deletion</span>
    </button>
}