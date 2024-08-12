import { koulen } from "./Fonts";

export default async function Loading() {
    return <div className="flex items-center justify-center !h-[29vw] max-lg:!h-[42vh] max-lg:py-8 w-full bg-gray bg-opacity-10 rounded-3xl">
        <h1 className={`${koulen.className} text-center text-5xl text-white`}>Loading</h1>
    </div>
}