"use client";
import { koulen } from "../Fonts";
import useDeleteState from "./DeleteState";

export default function DeleteButton() {
    const state = useDeleteState();
    return <button disabled={state.visible || state.deleting} onClick={() => state.setVisible(true)} className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 disabled:bg-opacity-80">
        <span className={`${koulen.className} text-white text-[2.5em]`}>Delete</span>
    </button>
}