import { validateRequest } from "../auth";
import Navbar from "../components/ui/Navbar"
import { redirect } from "next/navigation";
import "@/app/styles/guild-feed.scss";
import Menu from "../components/ui/menu/Menu";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Discord Feeds / Dashboard"
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { user, session } = await validateRequest();
    
    if (!session || !user) {
        return redirect("/");
    }

    return <div className="flex flex-col items-center gap-8 w-11/12 h-screen m-auto justify-center">
        <Menu />
        <Navbar avatarURL={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` || ""} />
        {children}
    </div>
}