"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { encodesans, encodesanssemi, koulen } from "../Fonts";
import { processUpgradeForm } from "@/app/utils/GuildServerActions";
import { DateTime } from "luxon";
import useFormStore from "./FormState";

export default function Form({ credits, guildId }: {
    credits: number,
    guildId: string
}) {
    const { payment, visible, showForm } = useFormStore();

    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true);

        await processUpgradeForm(guildId);
        router.refresh();
        
        showForm({
            visible: false
        });

        setLoading(false);
    }

    var date;
    if (payment?.expiresAt) {
        date = DateTime.fromJSDate(payment?.expiresAt).setZone("local").toLocaleString(DateTime.DATETIME_MED);
    }

    return visible && <div className="absolute m-auto w-screen h-screen z-10 bg-gray bg-opacity-20">
        <div className="flex flex-col p-5 absolute top-0 left-0 right-0 bottom-0 w-fit h-fit m-auto justify-center bg-white rounded-2xl gap-2 transition-all ease-in shadow-custom-form">
            <div className="flex flex-col items-center">
                <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Upgrade Guild</h1>
                <h1 className={`${encodesanssemi.className} font-medium text-xl`}><span className="text-darker-blue">⮩</span> +5 feeds upper limit <span className="text-darker-blue">⮨</span></h1>
            </div>

            <form className={`flex flex-col gap-5 text-center text-xl ${encodesans.className}`} onSubmit={onSubmit} >
                {!!payment &&
                    <div>
                        {!!payment.user &&
                            <>
                                <label htmlFor="upgraded_by">This guild has been upgraded by</label>
                                <input className="text-center" id="upgraded_by" type="text" value={payment.user.username} readOnly />
                            </>
                        }
                        <label htmlFor="expires_at">This upgrade will expire on</label>
                        <input className="text-center" id="expires_at" type="text" value={date} readOnly />
                    </div>
                }
                <div className="!flex-row items-center justify-center">
                    <button disabled={isLoading || !!payment || credits <= 0} type="submit" className="flex w-max items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer">
                        <label className={`${koulen.className} text-white text-[1.5em] cursor-pointer`}>Submit</label>
                    </button>
                    <button disabled={isLoading} type="reset" onClick={() => {
                        showForm({
                            visible: false
                        });
                    }} className="flex w-max items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer">
                        <label className={`${koulen.className} text-white text-[1.5em] cursor-pointer`}>Cancel</label>
                    </button>
                </div>
            </form>
        </div>
    </div>
}