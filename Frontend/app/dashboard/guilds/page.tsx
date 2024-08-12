import { validateRequest } from "@/app/auth";
import { koulen } from "@/app/components/ui/Fonts";
import GuildUI from "@/app/components/ui/Guild";
import { getGuilds } from "@/app/utils/GuildServerActions";
import Link from "next/link";

export default async function Page() {

    const { session } = await validateRequest();
    const guilds = await getGuilds(session?.accessToken as string);

    return <div className="h-4/5 w-full">
        <div className="flex max-md:flex-col w-full h-full bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className={`max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden max-md:min-w-full max-md:max-w-full max-md:h-1/4 max-md:min-h-[10em] ${guilds.length == 0 ? "hidden" : "w-fit"} overflow-y-auto flex flex-col px-5 items-center max-md:items-start bg-[#424B54] bg-opacity-10 py-5 gap-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]`}>
                {!!guilds && guilds.map(function (guild) {

                    if (guild.permissions.length == 0) return;

                    return <GuildUI
                        activated={false}
                        key={guild.id}
                        name={guild.name}
                        icon={guild.icon}
                        id={guild.id}
                    />
                })}
            </div>
            <div className={`flex flex-col items-center justify-center m-auto w-full h-full p-6`}>
                <h1 className={`${koulen.className} uppercase text-opacity-50 text-5xl text-gray text-center`}>No guild selected</h1>
                <h1 className={`${koulen.className} text-opacity-50 text-4xl text-gray text-center`}>
                    <span>Make sure you have </span>
                    <Link href="https://discord.com/community/permissions-on-discord-discord" target="_blank" rel="noopener noreferrer">
                        <span className="text-gray hover:underline hover:cursor-pointer">ADMINISTRATOR</span>
                    </Link>
                    <span> or </span>
                    <Link href="https://discord.com/community/permissions-on-discord-discord" target="_blank" rel="noopener noreferrer">
                        <span className="text-gray hover:underline hover:cursor-pointer">MANAGE SERVER</span>
                    </Link>
                    <span> permissions</span>
                </h1>
                <Link target="_blank" rel="noopener noreferrer" href="https://discord.com/oauth2/authorize?client_id=1132330295115395133&scope=bot&permissions=274877959168" className="mt-4 w-fit h-fit px-7 py-1 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80">
                    <span className={`${koulen.className} text-white text-[2.5em]`}>Add a guild</span>
                </Link>
            </div>
        </div>
    </div>
}