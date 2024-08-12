import Link from "next/link";
import { encodesans, koulen } from "../components/ui/Fonts";
import { validateRequest } from "../auth";

export default async function PrivacyPolicy() {
    const { session } = await validateRequest();
    return <div className="flex h-screen w-screen">
        <div className="flex flex-col items-center gap-8 w-11/12 h-4/5 m-auto justify-center rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10">
            <h1 className={`${koulen.className} text-5xl text-darker-blue text-center`}>Privacy Policy</h1>
            <div className={`${encodesans.className} flex flex-col items-start mr-auto gap-4 text-wrap text-lg overflow-y-auto w-full`}>
                <h2 className="text-2xl font-bold">Information We Collect</h2>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">Personal Information</span><br />
                    <span>When you register on https://discordfeeds.com using your Discord account, we collect the following information:</span>
                    <li>Discord's username</li>
                    <li>Discord's avatar URL</li>
                    <li>Access token</li>
                    <li>Refresh token</li>
                    <span>This information is provided by logging in through Discord (https://discord.com).</span><br />
                    <span><span className="font-bold">Note:</span> Upon the user clicking the designated button on the dashboard, only the specified information will be deleted. Additional information can be deleted upon request by contacting our support team.</span>
                </ul>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">User Generated Data</span><br />
                    <span>Users may provide additional information through the website, such as:</span>
                    <li>Guild ID</li>
                    <li>Interval for a feed</li>
                    <li>Name for a feed</li>
                    <li>Discord channel</li>
                    <li>Specified platform and details regarding that platform (e.g., YouTube channel URL, subreddit and subreddit's type)</li>
                </ul>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">Payment Information</span><br />
                    <span>For payment transactions, we store:</span>
                    <li>Unique user ID (generated using your Discord information)</li>
                    <li>Guild ID</li>
                    <li>Transaction date</li>
                    <li>Expiration date</li>
                    <li>Transaction ID (provided by Paddle, https://paddle.com)</li>
                    <li>Subscription status (Canceled or Active)</li>
                </ul>
                <h2 className="text-2xl font-bold">Data Storage</h2>
                <div>
                    <span className="text-xl font-bold">Hetzner's Servers</span><br />
                    <span>All collected data is stored on Hetzner's servers (https://hetzner.com). Hetzner Online GmbH is a professional web hosting provider and experienced data center operator in Germany. They ensure that your data is stored securely and protected against unauthorized access.</span>
                </div>
                <div>
                    <span className="text-xl font-bold">Access to Data</span><br />
                    <span>Access to your data is strictly limited to the administrators of https://discordfeeds.com<br />No other parties have access to this information.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Access to Data</h2>
                    <span>We take reasonable steps to protect your Personal Information from misuse, loss, and unauthorized access, modification, or disclosure. When Personal Information is no longer needed for the purpose for which it was obtained, we will take reasonable steps to destroy or permanently de-identify your Personal Information.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Legal Use</h2>
                    <span>Your Personal Data may be used for legal purposes by the administrators in court or in the stages leading to possible legal action arising from improper use of this website or the related services. You acknowledge that the administrators may be required to reveal personal data upon request of public authorities.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">System Logs and Maintenance</h2>
                    <span>For operation and maintenance purposes, this website and any third-party services may collect files that record interaction with this website (system logs) or use other Personal Data (such as IP Address) for this purpose.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Access to Personal Information</h2>
                    <span>If you wish to access your Personal Information, please contact us in writing. We will provide you with access to your personal data we hold about you. If you believe that any information we are holding on you is incorrect or incomplete, please contact us as soon as possible.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Changes to This Policy</h2>
                    <span>This Privacy Policy may change from time to time and is available on our website. We will notify you of any changes by posting the new Privacy Policy on this page.</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">About Discord</h2>
                    <span>Discord Inc. is a VoIP, instant messaging, and digital distribution platform designed for creating communities. Users communicate with voice calls, video calls, text messaging, media, and files in private chats or as part of communities called "servers."</span>
                </div>
            </div>
            <div className="flex gap-2 h-fit flex-wrap justify-center">
                <Link href={!!session ? "/dashboard/profile" : "/"} className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                    <span className={`${koulen.className} text-white text-[2.5em] text-center text-nowrap`}>{!!session ? "Go to dashboard" : "Go to home page"}</span>
                </Link>
                <Link href="/contact" className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                    <span className={`${koulen.className} text-white text-[2.5em] text-center text-nowrap`}>Contact us</span>
                </Link>
            </div>
        </div>
    </div>
}