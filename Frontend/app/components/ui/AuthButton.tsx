'use client';
import Image from "next/image";
import { koulen } from "./Fonts";

export default function AuthButton() {
    return <a href="/api/login/discord" className="flex w-max gap-4 items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
        <Image
            className="w-[3em]"
            src="/images/discord-mark-blue.svg"
            alt="Discord's Icon"
            width="32"
            height="32"
        />
        <span className={`${koulen.className} text-white text-[2.5em]`}>Connect</span>
    </a>
}