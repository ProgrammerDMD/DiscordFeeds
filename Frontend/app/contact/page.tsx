import Link from "next/link";
import { encodesans, koulen } from "../components/ui/Fonts";
import { validateRequest } from "../auth";

export default async function Contact() {
    const { session } = await validateRequest();
    return <div className="flex h-screen w-screen">
        <div className="flex flex-col items-center gap-8 w-11/12 h-4/5 m-auto justify-center rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h1 className={`${koulen.className} text-5xl text-darker-blue`}>Contact us</h1>
            <div className={`${encodesans.className} flex flex-col items-center gap-1 text-4xl text-center max-sm:text-2xl`}>
                <h2>Click to join the <Link className="font-bold hover:underline text-blue" href="https://discord.gg/GPB7jpBV5Q">discord server</Link></h2>
                {/* <h2>Send us an email at <a className="font-bold hover:underline text-blue" href="mailto: support@discordfeeds.com">support@discordfeeds.com</a></h2> */}
            </div>
            <Link href={ !!session ? "/dashboard/profile" : "/" } className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                <span className={`${koulen.className} text-white text-[2.5em] text-center text-nowrap`}>{ !!session ? "Go to dashboard" : "Go to home page" }</span>
            </Link>
        </div>
    </div>
}