import Link from "next/link";
import { encodesans, koulen } from "../components/ui/Fonts";
import { validateRequest } from "../auth";

export default async function Contact() {
    const { session } = await validateRequest();
    return <div className="flex h-screen w-screen">
        <div className="flex flex-col items-center gap-8 w-11/12 h-4/5 m-auto justify-center rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10">
            <div>
                <h1 className={`${koulen.className} text-5xl text-darker-blue text-center`}>Terms and Conditions</h1>
                <h2 className={`${encodesans.className} text-2xl text-center`}>Effective date: <span className="font-bold">July 29, 2024</span>.</h2>
            </div>
            <div className={`${encodesans.className} flex flex-col items-start mr-auto gap-4 text-wrap text-lg overflow-y-auto w-full`}>
                <span>Welcome to https://discordfeeds.com ("Website"). By using our services, you agree to the following Terms of Service ("Terms"). Please read them carefully. If you do not agree with these Terms, do not use our services.</span>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">1. Definitions</span>
                    <li><span className="font-bold">Guild:</span> A server on Discord where users can communicate with each other in various channels.</li>
                    <li><span className="font-bold">Feed:</span> An automated message sent to a Discord channel, retrieving public information from YouTube (https://youtube.com) and Reddit (https://reddit.com).</li>
                    <li><span className="font-bold">User:</span> Any individual who registers and uses the services provided by https://discordfeeds.com.</li>
                    <li><span className="font-bold">Guild credit:</span> A credit that can be used to upgrade a guild (server) on Discord for one month (31 days), allowing for an increased limit on the number of feeds that can be created for that guild.</li>
                    <li><span className="font-bold">Account:</span> A registered profile on https://discordfeeds.com that allows users to access and use the services provided by the website.</li>
                </ul>
                <div className="flex flex-col">
                    <span className="text-xl font-bold">2. Description of Service</span>
                    <span>https://discordfeeds.com provides an automated way to send messages to Discord channels by retrieving public information from YouTube (https://youtube.com) and Reddit (https://reddit.com).</span>
                </div>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">3. Account Registration</span>
                    <li>Accounts are registered using Discord (https://discord.com).</li>
                    <li>You can delete your account at any time through the dashboard at https://discordfeeds.com/dashboard/profile</li>
                    <li>Accounts will be deleted immediately upon the user clicking the designated button on the dashboard, provided there is no active subscription. If the user has an active subscription, the account will be deleted once the subscription period expires.</li>
                </ul>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">4. Usage Policy</span>
                    <li>Feeds should not be used to discriminate or harm other users. Any such use is strictly prohibited.</li>
                    <li>Users are not permitted to disrupt the service, spam the API, or engage in any activity that would violate Discord's Terms of Service (https://discord.com/terms).</li>
                    <li>If we are unable to retrieve public content multiple times in a row, we reserve the right to delete these feeds from our database. Users may recreate these feeds if desired.</li>
                    <li>The website owners are not liable for user activities. Accounts found engaging in illicit activities will be terminated and barred from creating new accounts.</li>
                </ul>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">5. Subscriptions and Payments</span>
                    <li>Users can subscribe to a monthly subscription (31 days) at the set price, which provides access to the "Webhooks" section of the dashboard (https://discordfeeds.com/dashboard/webhooks) and one additional guild credit.</li>
                    <li>Subscriptions can be canceled via the dashboard at https://discordfeeds.com/dashboard/profile</li>
                    <li>Payments are processed through Paddle (https://paddle.com). We do not store any banking information.</li>
                </ul>
                <ul className="list-disc list-inside">
                    <span className="text-xl font-bold">6. Refund Policy</span>
                    <li>Refunds can be requested at any time by contacting us at https://discordfeeds.com/contact</li>
                    <li>We are happy to provide refunds. In the case of a chargeback, we reserve the right to terminate the account.</li>
                </ul>
                <div className="flex flex-col">
                    <span className="text-xl font-bold">7. Service Interruptions</span>
                    <span>We reserve the right to interrupt access to the website for maintenance, system updates, or other necessary changes. Users will be appropriately informed of such interruptions.</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold">8. Legal Compliance</span>
                    <span>By signing up, you agree and warrant that you are legally authorized in your jurisdiction to use the website and to interact with it in any way.</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold">9. Limitation of Liability</span>
                    <span>The website owners are not liable for any direct, indirect, incidental, special, or consequential damages resulting from any user's conduct or inability to use the service.</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold">10. Changes to the Terms</span>
                    <span>We reserve the right to modify these Terms at any time. Changes will be posted on this page, and your continued use of the website constitutes acceptance of the new Terms.</span>
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