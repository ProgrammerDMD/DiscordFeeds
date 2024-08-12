'use client';

import { koulen } from "@/app/components/ui/Fonts";
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return <>
        <div className="h-4/5 w-full">
            <div className="flex w-full h-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className={`flex flex-col gap-2 items-center justify-center w-full p-6`}>
                    <h1 className={`${koulen.className} uppercase text-opacity-50 text-5xl text-gray text-center`}>{error.message}</h1>
                    <button className="w-fit h-fit px-5 py-2 rounded-full bg-blue bg-opacity-40 transition-colors duration-100 ease-linear hover:bg-opacity-55"
                        onClick={() => reset()}>
                        <span className={`${koulen.className} text-darker-blue text-3xl`}>Try again</span>
                    </button>
                </div>
            </div>
        </div>
    </>
}