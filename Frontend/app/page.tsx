import { Encode_Sans_Condensed, Koulen } from "next/font/google";
import AuthButton from "./components/ui/AuthButton";
import { redirect } from "next/navigation";
import { validateRequest } from "./auth";
import Image from "next/image";
import Link from "next/link";
import { getTotalGuilds } from "./utils/GuildServerActions";
import Loading from "./components/ui/Loading";
import dynamic from "next/dynamic";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"]
});

const encodesans = Encode_Sans_Condensed({
  weight: ["100", "400", "600"],
  subsets: ["latin"]
});

export default async function Home() {

  const { session } = await validateRequest();

  if (session) {
    return redirect("/dashboard/guilds");
  }

  var totalGuilds = 0;
  await getTotalGuilds().then((value) => {
    totalGuilds = value;
  }).catch((error) => {
    console.log(error);
  });

  const SplineLoading = dynamic(() => import("./components/ui/SplineComponent"), {
    ssr: false, loading: () => <Loading />
  });

  return <div className="flex flex-row gap-10 items-center justify-center m-auto h-screen max-lg:flex-col px-32 max-lg:px-0 overflow-y-auto max-lg:h-fit">
    <div className="flex flex-col w-[32vw] max-lg:w-auto gap-16 max-lg:gap-3 max-lg:items-center max-lg:justify-center max-lg:p-8 max-lg:min-h-screen max-lg:h-fit">
      <div className="flex items-center gap-2 h-fit w-fit">
        <Image
          alt="Icon"
          width={32}
          height={32}
          src="/discord-feeds.svg"
        />
        <h1 className={`${koulen.className} uppercase text-2xl text-blue`}>Discord Feeds</h1>
      </div>
      <div className="flex flex-col gap-1">
        <p style={{ fontSize: "clamp(1.5rem, 0.9516rem + 1.2903vw, 2.5rem)" }} className={`${encodesans.className} text-gray leading-[1.1] font-bold max-lg:text-center`}>Receive notifications from your favorite<br /> social media platforms on <span className="text-blue">Discord Channels</span> or through <span className="text-blue">Webhooks</span></p>
        <p style={{ fontSize: "clamp(1rem, 0.7258rem + 0.6452vw, 1.5rem)" }} className={`${encodesans.className} font-thin text-gray max-lg:text-center`}>YouTube & Reddit</p>
        <span style={{ fontSize: "clamp(0.875rem, 0.6694rem + 0.4839vw, 1.25rem)" }} className={`${encodesans.className} mt-2 items-center font-medium text-gray max-lg:text-center`}><span className="text-blue">⮩</span> Online on <span className="text-blue">{totalGuilds}</span> guilds</span>
      </div>
      <div className="flex flex-col items-start gap-3 max-lg:items-center">
        <AuthButton />
        <span className={`${encodesans.className} text-base max-lg:text-center text-gray`}>By signing up you agree to our <Link href="/termsandconditions" className="font-bold hover:underline">"Terms & Conditions"</Link> and <Link href="/privacypolicy" className="font-bold hover:underline">"Privacy Policy"</Link></span>
      </div>
    </div>
    <SplineLoading />
  </div>
}
