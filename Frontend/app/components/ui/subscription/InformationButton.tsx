"use client";

import useSubscriptionStore from "./SubscriptionState";
import { koulen } from "../Fonts";

export default function InformationButton({ isSubscribed }: {
    isSubscribed: boolean
}) {
    const { setVisible } = useSubscriptionStore();

    return <button className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80"
        onClick={() => setVisible(true)}>
        <span className={`${koulen.className} text-white text-xl`}>{  isSubscribed ? "Information" : "Activate" }</span>
    </button>
}