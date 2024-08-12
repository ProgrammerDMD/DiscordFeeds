"use client";

import Image from "next/image";
import useFormStore from "./FormState";

export default function AddButton() {
    const { showForm } = useFormStore();

    return <button onClick={
        e => showForm({
            visible: true
        })}
    >
        <div className="bg-blue bg-opacity-50 p-4 rounded-full transition-shadow ease-out duration-[175ms] shadow hover:shadow-custom">
            <Image
                src="/images/plus-image.svg"
                width={28}
                height={28}
                alt="Add Feed"
            />
        </div>
    </button>
};;