"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { encodesanssemi, koulen } from "./Fonts";

export default function EventModal({ type }: {
    type: "purchase" | "cancel_error" | "resume_error" | "delete_error" | "cancel_delete_error"
}) {
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    return visible && <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10">
        <div className="flex flex-col items-center gap-3 p-6 absolute top-0 left-0 right-0 bottom-0 w-fit h-fit m-auto bg-white rounded-2xl transition-all ease-in shadow-custom-form">
            {type === "purchase" &&
                <>
                    <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Thank you for the purchase</h1>
                    <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black`}>You should receive your benefits in a couple of seconds.<br />
                        <Link href="/contact" target="_blank" rel="noopener noreferrer">
                            <span className="font-bold hover:underline hover:cursor-pointer">Contact us</span>
                        </Link>
                        <span> if you consider that a problem occurred.</span>
                    </h2>
                </>
            }
            {type === "cancel_error" &&
                <>
                    <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Couldn't cancel the subscription</h1>
                    <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black`}>An error has occurred while cancelling the subscription!<br />
                        <Link href="/contact" target="_blank" rel="noopener noreferrer">
                            <span className="font-bold hover:underline hover:cursor-pointer">Contact us</span>
                        </Link>
                        <span> if the problem can't be solved on its own.</span>
                    </h2>
                </>
            }
            {type === "resume_error" &&
                <>
                    <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Couldn't resume the subscription</h1>
                    <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black`}>An error has occurred while resuming the subscription!<br />
                        <Link href="/contact" target="_blank" rel="noopener noreferrer">
                            <span className="font-bold hover:underline hover:cursor-pointer">Contact us</span>
                        </Link>
                        <span> if the problem can't be solved on its own.</span>
                    </h2>
                </>
            }
            {type === "delete_error" &&
                <>
                    <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Couldn't delete the account</h1>
                    <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black`}>An error has occurred while deleting the account!<br />
                        <Link href="/contact" target="_blank" rel="noopener noreferrer">
                            <span className="font-bold hover:underline hover:cursor-pointer">Contact us</span>
                        </Link>
                        <span> if the problem can't be solved on its own.</span>
                    </h2>
                </>
            }
            {type === "cancel_delete_error" &&
                <>
                    <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>Couldn't cancel the deleting process</h1>
                    <h2 className={`${encodesanssemi.className} font-normal text-center text-2xl text-black`}>An error has occurred while canceling the deleting process of the account!<br />
                        <Link href="/contact" target="_blank" rel="noopener noreferrer">
                            <span className="font-bold hover:underline hover:cursor-pointer">Contact us</span>
                        </Link>
                        <span> if the problem can't be solved on its own.</span>
                    </h2>
                </>
            }
            <button className="w-fit h-fit px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80"
                onClick={() => {
                    setVisible(false);
                    router.push("/dashboard/profile");
                    router.refresh();
                }}>
                <span className={`${koulen.className} text-white text-2xl`}>Close</span>
            </button>
        </div>
    </div>
}