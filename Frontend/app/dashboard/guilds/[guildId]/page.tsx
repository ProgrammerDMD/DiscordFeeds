import GuildUI from "../../../components/ui/Guild";
import { getFeeds, getGuilds } from "@/app/utils/GuildServerActions";
import { validateRequest } from "@/app/auth";
import { koulen } from "@/app/components/ui/Fonts";
import { default as FeedForm } from "@/app/components/ui/feed/guild/Form";
import FeedButton from "@/app/components/ui/feed/FeedButton";
import AddButton from "@/app/components/ui/feed/AddButton";
import UpgradeButton from "@/app/components/ui/upgrade/UpgradeButton";
import { isGuildActive } from "@/app/components/backend/database";
import { default as UpgradeForm } from "@/app/components/ui/upgrade/Form";
import { GuildPayment, User } from "../../../components/backend/db/schema";
import { MAXIMUM_FEEDS_NOT_UPGRADED, MAXIMUM_FEEDS_UPGRADED } from "../../../utils/Utils";

export default async function Page({ params }: {
    params: any
}) {
    const { user, session } = await validateRequest();
    if (!user || session == null) return;

    const [guilds, feeds] = await Promise.all([getGuilds(session.accessToken), getFeeds(params.guildId)]);
    const payment: {
        payment: GuildPayment | undefined,
        user: User | undefined
    } = await isGuildActive(params.guildId);

    return <>
        <FeedForm guildId={params.guildId} />
        <UpgradeForm credits={user.guildCredits} guildId={params.guildId} />
        <div className="h-4/5 w-full">
            <div className="flex max-md:flex-col w-full h-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className={`max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden max-md:min-w-full max-md:max-w-full max-md:h-1/4 max-md:min-h-[10em] ${guilds.length == 0 ? "hidden" : "w-fit"} overflow-y-auto flex flex-col px-5 items-center max-md:items-start bg-[#424B54] bg-opacity-10 py-5 gap-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]`}>
                    {!!guilds && guilds.map((guild) => {
                        return <GuildUI
                            activated={params.guildId == guild.id}
                            key={guild.id}
                            name={guild.name}
                            icon={guild.icon}
                            id={guild.id}
                        />
                    })}
                </div>
                {feeds.length > 0 && <div className={`flex flex-col gap-10 w-full p-6 overflow-y-auto`}>
                    <h1 className={`${koulen.className} uppercase text-opacity-50 text-4xl text-gray text-center`}>{feeds.length}/{!!payment.payment ? MAXIMUM_FEEDS_UPGRADED : MAXIMUM_FEEDS_NOT_UPGRADED} feeds created</h1>
                    <div className={`grid items-center gap-4 justify-center`} style={{ gridTemplateColumns: "repeat(auto-fill, 9em)" }}>
                        {!!feeds && feeds.map((feed) => {
                            return <FeedButton
                                key={feed.id}
                                options={feed}
                            />
                        })}
                    </div>
                </div>}
                {feeds.length == 0 && <div className={`flex items-center justify-center w-full h-full p-6`}>
                    <h1 className={`${koulen.className} uppercase text-opacity-50 text-5xl text-gray text-center m-auto`}>No feeds have been created yet</h1>
                </div>}
            </div>
            <div className="relative">
                <div className="flex gap-2 absolute bottom-0 right-0 m-6">
                    <AddButton />
                    <UpgradeButton payment={payment.payment} user={payment.user} />
                </div>
            </div>
        </div>
    </>
}