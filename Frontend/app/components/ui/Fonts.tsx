import { Koulen, Encode_Sans_Condensed, Encode_Sans_Semi_Condensed } from "next/font/google";

export const koulen = Koulen({
    weight: "400",
    subsets: ["latin"]
});

export const encodesans = Encode_Sans_Condensed({
    weight: ["100", "400", "600"],
    subsets: ["latin"]
});

export const encodesanssemi = Encode_Sans_Semi_Condensed({
    weight: ["100", "200", "400", "600"],
    subsets: ["latin"],
});