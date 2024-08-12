"use client";

import Image from "next/image";
import { FeedResponse } from "@/types/APITypes";
import { encodesans } from "../Fonts";
import useFormStore from "./FormState";

export default function FeedButton({ options }: {
    options: FeedResponse
}) {

    const { showForm } = useFormStore();

    return <button className="w-36 h-12" onClick={() => {
        showForm({
            visible: true,
            options: options
        })
    }}>
        <div className="w-full h-full bg-blue bg-opacity-20 flex justify-center items-center gap-2 rounded-xl transition-shadow ease-out duration-150 hover:shadow-custom">
            <Image
                className=""
                src={`/images/${options.jobDetails.job_type.toLowerCase()}.svg`}
                width={34}
                height={34}
                alt={options.jobDetails.job_type}
            />
            <h1 className={`${encodesans.className} text-xl text-nowrap overflow-hidden w-[50%]`}>{options.jobDetails.name}</h1>
        </div>
    </button>
}