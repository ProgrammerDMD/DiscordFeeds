"use client";
import Link from "next/link";
import { encodesanssemi, koulen } from "../Fonts";
import useSubscriptionStore from "./SubscriptionState";
import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { UserPayment } from "../../backend/db/schema";

export default function SubscriptionModal({ userId, payment, successUrl, productId, environment, clientId }: {
    userId: string,
    payment: UserPayment | undefined,
    successUrl: string,
    productId: string,
    environment: "production" | "sandbox",
    clientId: string
}) {
    const [paddle, setPaddle] = useState<Paddle>();
    const { visible, setVisible } = useSubscriptionStore();

    useEffect(() => {
        async function fetchPaddle() {
            const paddleInstance = await initializePaddle({
                environment: environment, token: clientId, debug: false, checkout: {
                    settings: {
                        displayMode: "overlay",
                        successUrl: successUrl + "/dashboard/profile?event=success",
                        showAddTaxId: false,
                        showAddDiscounts: false
                    }
                }
            });
            setPaddle(paddleInstance);
        }
        fetchPaddle();
    }, []);

    const openCheckout = () => {
        paddle?.Checkout.open({
            items: [{
                priceId: productId,
            }],
            customData: {
                userId: userId
            }
        })
    }

    return visible && <div className="absolute m-auto w-screen h-screen z-10 bg-gray bg-opacity-20">
        <div className="flex flex-col gap-3 p-6 absolute top-0 left-0 right-0 bottom-0 w-fit h-fit m-auto justify-center bg-white rounded-2xl transition-all ease-in shadow-custom-form">
            <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>DiscordFeeds Premium</h1>
            <div>
                <h2 className={`${encodesanssemi.className} font-normal text-lg text-black`}>Benefits provided by purchasing the subscription</h2>
                <ul className={`${encodesanssemi.className} text-lg`}>
                    <li><span className="text-darker-blue">⮩</span> Access to <Link href="/dashboard/webhooks" className="font-bold hover:underline" onClick={() => setVisible(false)}>Webhooks</Link> section</li>
                    <li><span className="text-darker-blue">⮩</span> 1 guild credit for upgrading a server</li>
                </ul>
            </div>
            <h3 className={`${encodesanssemi.className} font-normal text-center text-lg text-black`}>Priced at <span className="font-bold">€3.99</span> per month</h3>
            <div className="flex flex-row justify-center gap-2 flex-">
                <button disabled={payment !== undefined} className="w-fit h-fit px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer"
                    onClick={() => openCheckout()}>
                    <span className={`${koulen.className} text-white text-2xl`}>Subscribe now</span>
                </button>
                <button className="w-fit h-fit px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80"
                    onClick={() => setVisible(false)}>
                    <span className={`${koulen.className} text-white text-2xl`}>Close</span>
                </button>
            </div>
        </div>
    </div>
}