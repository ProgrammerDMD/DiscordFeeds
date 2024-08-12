import { koulen } from "@/app/components/ui/Fonts";
import { validateRequest } from "@/app/auth";
import { getFeeds } from "@/app/utils/WebhookServerAction";
import { FeedResponse } from "@/types/APITypes";
import Form from "@/app/components/ui/feed/webhook/Form";
import FeedButton from "@/app/components/ui/feed/FeedButton";
import AddButton from "@/app/components/ui/feed/AddButton";
import { getUserPayment } from "@/app/components/backend/database";
import Link from "next/link";
import { MAXIMUM_FEEDS_WEBHOOKS } from "../../utils/Utils";

export default async function Page() {

    const { user } = await validateRequest();
    const payment = await getUserPayment(user?.id as string);

    if (!payment) {
        return <>
            <div className="h-4/5 w-full">
                <div className="flex h-full w-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className={`flex items-center justify-center w-full`}>
                        <h1 className={`${koulen.className} uppercase text-opacity-50 text-5xl text-gray text-center`}>Only <Link href="/dashboard/profile"><span className="text-gray hover:underline hover:cursor-pointer">subscribers</span></Link> have access to this section</h1>
                    </div>
                </div>
            </div>
        </>
    }

    const feeds: FeedResponse[] = await getFeeds();

    return <>
        <Form />
        <div className="h-4/5 w-full">
            <div className="flex h-full w-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {feeds.length > 0 && <div className={`flex flex-col gap-10 p-6 overflow-y-auto w-full`}>
                    <h1 className={`${koulen.className} uppercase text-opacity-50 text-4xl text-gray text-center`}>{feeds.length}/{MAXIMUM_FEEDS_WEBHOOKS} feeds created</h1>
                    <div className={`grid items-center gap-4 justify-center`} style={{ gridTemplateColumns: "repeat(auto-fill, 9em)" }}>
                        {!!feeds && feeds.map((feed) => {
                            return <FeedButton
                                key={feed.id}
                                options={feed}
                            />
                        })}
                    </div>
                </div>}
                {feeds.length == 0 && <div className={`flex items-center justify-center w-full`}>
                    <h1 className={`${koulen.className} uppercase text-opacity-50 text-5xl text-gray text-center`}>No feeds have been created yet</h1>
                </div>}
            </div>
            <div className="relative">
                <div className="flex gap-2 absolute bottom-0 right-0 m-6">
                    <AddButton />
                </div>
            </div>
        </div>
    </>
}