import Link from 'next/link'
import Image from 'next/image';
import { encodesans } from "./Fonts";

export default function Guild({ activated, name, icon, id }: Readonly<{
    activated: boolean,
    name: string,
    icon: string | null,
    id: string
}>) {
    return <Link className="w-96 max-md:my-auto max-md:max-w-fit max-w-full" href={`/dashboard/guilds/${id}`}>
        <div className={`flex px-2 py-2 w-full max-md:w-max rounded-full bg-blue ${activated ? "bg-opacity-[0.75]" : "bg-opacity-[0.33] transition-colors ease-in-out duration-200 hover:bg-opacity-50"} items-center justify-center`}>
            <Image
                className="rounded-full w-[5em] h-[5rem]"
                src={!!icon ? icon : "/discord-feeds.svg"}
                alt="Guild Image"
                width={128}
                height={128} />

            <h1 className={`${encodesans} font-extralight text-2xl ${!!icon ? "w-3/4" : "w-full"} h-8 truncate text-center px-5 max-md:hidden`}>{name}</h1>
        </div>
    </Link>
}