"use client";
import Link from "next/link";
import { koulen } from "../Fonts";
import useMenuState from "./MenuState";
import "@/app/styles/material-symbols.scss";

export default function Menu() {
    const state = useMenuState();
    return state.visible && <div className="absolute w-screen h-screen z-10 overflow-hidden hidden max-md:block">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <button className={`${koulen.className} absolute z-20 w-fit h-fit right-0 m-6`} onClick={() => {
            if (state.visible) state.setVisible(false);
            }}>
            <span className="material-symbols-outlined !text-7xl">close</span>
        </button>
        <div className="flex flex-col items-center gap-4 p-6 absolute top-0 left-0 right-0 bottom-0 w-full h-full justify-center bg-white">
            <Link onClick={() => state.setVisible(false)} href="/dashboard/guilds" className="flex w-4/5 gap-4 items-center px-5 py-4 rounded-full bg-blue">
                <span className={`${koulen.className} text-white text-6xl mx-auto`}>Guilds</span>
            </Link>
            <Link onClick={() => state.setVisible(false)} href="/dashboard/webhooks" className="flex w-4/5 gap-4 items-center px-5 py-4 rounded-full bg-blue">
                <span className={`${koulen.className} text-white text-6xl mx-auto`}>Webhooks</span>
            </Link>
            <Link onClick={() => state.setVisible(false)}  href="/dashboard/profile" className="flex w-4/5 gap-4 items-center px-5 py-4 rounded-full bg-blue">
                <span className={`${koulen.className} text-white text-6xl mx-auto`}>Profile</span>
            </Link>
        </div>
    </div>
}