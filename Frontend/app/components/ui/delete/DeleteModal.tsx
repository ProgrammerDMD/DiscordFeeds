"use client";
import { encodesanssemi, koulen } from "../Fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useDeleteState from "./DeleteState";
import { deleteUserDB, logout } from "@/app/utils/ServerActions";

export default function DeleteModal({ subscribed }: {
    subscribed: boolean
}) {
    const state = useDeleteState();
    const router = useRouter();

    const deleteAccount = async () => {
        state.setDeleting(true);
        
        const response = await deleteUserDB();
        state.setDeleting(false);
        state.setVisible(false);
        
        if (response && response.message) {
            router.push("/dashboard/profile?event=delete_error");
            return;
        } else if (!subscribed) {
            await logout();
        }

        router.refresh();
    }

    return state.visible && <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10">
        <div className="flex flex-col items-center gap-3 p-6 absolute top-0 left-0 right-0 bottom-0 w-fit h-fit m-auto bg-white rounded-2xl transition-all ease-in shadow-custom-form">
            <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Are you sure you want to proceed?</h1>
            <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black text-wrap`}><span>This action will delete your account according to our </span>
                <Link href="/termsandconditions" target="_blank" rel="noopener noreferrer">
                    <span className="font-bold hover:underline hover:cursor-pointer">Terms and Conditions</span>
                </Link>
                <span> and </span>
                <Link href="/privacypolicy" target="_blank" rel="noopener noreferrer">
                    <span className="font-bold hover:underline hover:cursor-pointer">Privacy Policy</span>
                </Link>
            </h2>
            <div className="flex gap-2 flex-wrap justify-center">
                <button disabled={state.deleting} className="w-fit h-fit px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 disabled:bg-opacity-80"
                    onClick={() => deleteAccount()}>
                    <span className={`${koulen.className} text-white text-2xl`}>Delete</span>
                </button>
                <button disabled={state.deleting} className="w-fit h-fit px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 disabled:bg-opacity-80"
                    onClick={() => {
                        state.setVisible(false);
                        router.push("/dashboard/profile");
                    }}>
                    <span className={`${koulen.className} text-white text-2xl`}>Close</span>
                </button>
            </div>
        </div>
    </div>
}