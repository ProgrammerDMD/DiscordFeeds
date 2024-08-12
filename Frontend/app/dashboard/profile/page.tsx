import { validateRequest } from "@/app/auth";
import { getUserPayment } from "@/app/components/backend/database";
import CancelDeleteButton from "@/app/components/ui/delete/CancelDeleteButton";
import DeleteButton from "@/app/components/ui/delete/DeleteButton";
import DeleteModal from "@/app/components/ui/delete/DeleteModal";
import EventModal from "@/app/components/ui/EventModal";
import { encodesans, koulen } from "@/app/components/ui/Fonts";
import CancelResumeButton from "@/app/components/ui/subscription/CancelResumeButton";
import InformationButton from "@/app/components/ui/subscription/InformationButton";
import SubscriptionModal from "@/app/components/ui/subscription/SubscriptionModal";
import { logout } from "@/app/utils/ServerActions";
import { DateTime } from "luxon";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Discord Feeds / Profile"
}

export default async function Page({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { user } = await validateRequest();

    const payment = await getUserPayment(user?.id as string);
    const event = searchParams["event"];

    var date;
    if (payment) {
        date = DateTime.fromJSDate(payment.expiresAt).setZone("local").toLocaleString(DateTime.DATETIME_MED);
    }

    return <>
        {!!event && event === "success" &&
            <EventModal type="purchase" />
        }
        {!!event && event === "cancel_error" &&
            <EventModal type="cancel_error" />
        }
        {!!event && event === "resume_error" &&
            <EventModal type="resume_error" />
        }
        {!!event && event === "delete_error" &&
            <EventModal type="delete_error" />
        }
        {!!event && event === "cancel_delete_error" &&
            <EventModal type="cancel_delete_error" />
        }
        <DeleteModal subscribed={!!payment} />
        <SubscriptionModal userId={user?.id as string} payment={payment} successUrl={process.env.BASE_URL!} />
        <div className="h-4/5 w-full">
            <div className="overflow-y-auto flex flex-col items-center h-full w-full p-10 gap-3 bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="flex flex-col items-center h-fit w-full bg-blue bg-opacity-10 py-5 gap-2 rounded-3xl">
                    <h1 className={`${koulen.className} text-3xl text-gray`}>User Details</h1>
                    <h3 className={`${encodesans.className} font-medium px-3 py-2 bg-gray text-white rounded-xl`}>{user?.guildCredits} guild credits</h3>
                </div>
                <div className="flex flex-col items-center h-fit w-full bg-blue bg-opacity-10 py-5 gap-2 rounded-3xl">
                    <h1 className={`${koulen.className} text-3xl text-gray`}>Subscription Details</h1>
                    <div className="flex flex-col items-center" style={{
                        backdropFilter: "none"
                    }}>
                        <h3 className={`${encodesans.className} font-medium px-3 py-2 bg-gray text-white rounded-xl w-fit`}>{payment ? "Active" : "Not active"}</h3>
                        {!!payment &&
                            <div className="flex flex-col items-center gap-1" style={{
                                backdropFilter: "none"
                            }}>
                                <label className={`${encodesans.className}`} htmlFor="expires_at">{payment.status === "active" ? "This subscription will renew on" : "This subscription will expire on"}</label>
                                <input id="expires_at" className={`text-center border border-black border-solid rounded-3xl px-4 py-2 ${encodesans.className}`} type="text" value={date} readOnly />
                            </div>
                        }
                    </div>
                    <div className="flex flex-wrap flex-row items-center justify-center gap-2 px-2" style={{
                        backdropFilter: "none"
                    }}>
                        <InformationButton isSubscribed={!!payment} />
                        {!!payment && <CancelResumeButton status={payment.status} />}
                    </div>
                </div>
                <div className="flex justify-center items-center h-fit w-full bg-blue bg-opacity-10 py-5 gap-2 rounded-3xl flex-wrap px-2">
                    <Link href="/contact" className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                        <span className={`${koulen.className} text-white text-xl`}>Contact us</span>
                    </Link>
                    <Link href="/termsandconditions" className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                        <span className={`${koulen.className} text-white text-xl`}>Terms and Conditions</span>
                    </Link>
                    <Link href="/privacypolicy" className="w-fit h-fit px-5 py-2 rounded-full bg-darker-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                        <span className={`${koulen.className} text-white text-xl`}>Privacy Policy</span>
                    </Link>
                </div>
                <div className="flex gap-2 mt-auto flex-wrap justify-center">
                    { user?.deleting ? <CancelDeleteButton /> : <DeleteButton /> }
                    <form action={logout}>
                        <button className="w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                            <span className={`${koulen.className} text-white text-[2.5em]`}>Log out</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>
}