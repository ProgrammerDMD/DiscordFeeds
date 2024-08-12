"use client";

import Image from "next/image";
import { encodesans, koulen } from "../../Fonts";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FeedType } from "@/types/APITypes";
import { useRouter } from "next/navigation";
import { WebhookFormSchema, WebhookFormSchemaType } from "@/types/form/WebhookFormSchema";
import { deleteFeed, processForm } from "@/app/utils/WebhookServerAction";
import useFormStore from "../FormState";
import { errors as responseErrors } from "@/app/utils/Utils";

const intervals = [
    {
        "name": "5 minutes",
        "interval": 60 * 5
    },
    {
        "name": "10 minutes",
        "interval": 60 * 10
    },
    {
        "name": "30 minutes",
        "interval": 60 * 30
    },
    {
        "name": "1 hour",
        "interval": 60 * 60 * 1
    },
    {
        "name": "6 hours",
        "interval": 60 * 60 * 6
    },
    {
        "name": "12 hours",
        "interval": 60 * 60 * 12
    },
    {
        "name": "24 hour",
        "interval": 60 * 60 * 24
    }
];

export default function Form() {
    const { options, visible, showForm } = useFormStore();

    const { register, watch, handleSubmit, formState, reset, setError, clearErrors, getValues } = useForm<WebhookFormSchemaType>({
        defaultValues: {
            name: "",
            webhook: "",
            interval: "300"
        },
        resolver: zodResolver(WebhookFormSchema),
        criteriaMode: "all",
        shouldUnregister: true
    });

    const { isValid, errors, isSubmitting } = formState;

    useEffect(() => {
        reset((options !== undefined) ? {
            name: options.jobDetails.name,
            webhook: options.jobDetails.webhook,
            interval: String(options.interval),
            platform: {
                ...options.jobDetails,
                platform: options.jobDetails.job_type as any,
                url: options.jobDetails.youtubeUrl
            }
        } : {
            name: "",
            webhook: "",
            interval: "300"
        });
    }, [options, visible, showForm]);

    const router = useRouter();
    const onSubmit: SubmitHandler<WebhookFormSchemaType> = async (data) => {
        await processForm({
            id: options?.id,
            form: data
        }).then((value) => {
            if (value?.message) {
                setError("platform", {
                    type: "custom",
                    message: value.message
                });
                return;
            }

            showForm({
                visible: false
            });

            reset();
            router.refresh();
        }).catch((reason) => {
            console.error(reason);
            setError("platform", {
                type: "custom",
                message: responseErrors.SERVER_UNKNOWN_ERROR.message
            });
        });
    }

    const [getMessage, setMessage] = useState<string | undefined>("");
    const [isDeleting, setDeleting] = useState<boolean>(false);

    useEffect(() => {
        async function deleteFeedFunc() {
            if (isDeleting && options?.id) {
                await deleteFeed(options?.id);
                setDeleting(false);

                reset({});
                showForm({
                    visible: false
                });

                router.refresh();
            }
        }

        deleteFeedFunc();
    }, [isDeleting]);

    useEffect(() => {
        if (isValid) clearErrors("platform");
    }, [isValid, getValues("platform.platform")]);

    useEffect(() => {
        clearErrors("platform");
    }, [getValues("platform.platform")]);

    useEffect(() => {
        var message = Object.values(errors).flatMap((value) => {
            var nestedValues = Object.values(value).flatMap((nestedValue) => {
                return nestedValue?.message;
            }).filter((value) => {
                if (value !== undefined) return value;
            });

            if (nestedValues.length > 0) {
                return nestedValues[0];
            }

            return value?.message;
        }).filter((value) => {
            if (value !== undefined) return value;
        })[0];

        setMessage(message);
    }, [formState]);

    return visible && <div className="absolute m-auto w-screen h-screen z-10 bg-gray bg-opacity-20 overflow-y-auto">
        <div className="overflow-y-auto flex flex-col p-5 absolute top-0 left-0 right-0 bottom-0 w-fit max-w-[80%] h-fit max-h-[80%] m-auto justify-center bg-white rounded-2xl gap-2 transition-all ease-in shadow-custom-form">
            <h1 className={`${koulen.className} uppercase text-center text-4xl text-darker-blue`}>{options?.id !== undefined ? "Modify feed" : "Add a new feed"}</h1>
            <form id="webhook-form" className={`overflow-y-auto px-4 py-2 mb-2 flex flex-col gap-5 text-center text-xl ${encodesans.className}`} onSubmit={handleSubmit(onSubmit)} >
                <div>
                    <label htmlFor="name">What name do you want for you feed?</label>
                    <input id="name" {...register("name")} type="text" placeholder="Feed for r/memes" />
                </div>

                <div>
                    <label htmlFor="webhook">What is the webhook's url?</label>
                    <input id="webhook" {...register("webhook")} type="text" placeholder="https://discord.com/api/webhooks/1234567890/abcdefgzhijklmno" />
                </div>

                <div>
                    <label htmlFor="interval">What's the interval to check for a new feed?</label>
                    <div className="bg-white rounded-3xl">
                        <select id="interval" {...register("interval")} className="px-4 py-2 w-full font-bold">
                            <option key="select" value={"-1"} hidden={true}>No interval selected</option>
                            {
                                intervals.map((value) => {
                                    return <option key={value.name} value={value.interval.toString()}>{value.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="type">From what platform do you want to get this feed?</label>
                    <div id="type" className="flex gap-2">
                        <label htmlFor="youtube-platform">
                            <input id="youtube-platform" {...register("platform.platform")} type="radio" value="YouTube" />
                            <Image
                                src={"/images/youtube.svg"}
                                width={34}
                                height={34}
                                alt="YouTube"
                            />
                        </label>
                        <label htmlFor="reddit-platform">
                            <input id="reddit-platform" {...register("platform.platform")} type="radio" value="Reddit" />
                            <Image
                                src={"/images/reddit.svg"}
                                width={34}
                                height={34}
                                alt="Reddit"
                            />
                        </label>
                    </div>
                </div>

                {watch("platform.platform") == FeedType.YouTube &&
                    <div>
                        <label htmlFor="youtube-url">What is the channel's URL?</label>
                        <input id="youtube-url" {...register("platform.url")} type="url" placeholder="https://www.youtube.com/@YouTube" />
                    </div>
                }

                {watch("platform.platform") == FeedType.Reddit &&
                    <div className="flex !flex-row !gap-4 max-md:!flex-col max-md:items-center">
                        <div className="flex flex-col gap-2 max-md:w-full">
                            <label htmlFor="subreddit">What is the subreddit's name?</label>
                            <input id="subreddit" {...register("platform.subreddit")} className="w-fit max-md:w-full" type="text" placeholder="memes" />
                        </div>
                        <div className="flex flex-col gap-2 max-md:w-full">
                            <label htmlFor="sortby">Choose a "Sort by" option</label>
                            <div className="bg-white rounded-3xl">
                                <select id="sortby" {...register("platform.type")} className="px-4 py-2 w-full font-bold">
                                    <option key="new" value="new">New</option>
                                    <option key="hot" value="hot">Hot</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </form>

            {
                !!getMessage &&
                <span className={`${encodesans.className} bg-gray text-white rounded-xl p-2 text-center text-xl`}>
                    {getMessage}
                </span>
            }

            <div className="flex flex-row flex-wrap items-center align-middle gap-2 justify-center">
                <button form="webhook-form" disabled={isSubmitting || isDeleting} type="submit" className="flex w-max items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer">
                    <label className={`${koulen.className} text-white text-[1.5em] cursor-pointer`}>Submit</label>
                </button>
                <button disabled={isSubmitting || isDeleting} type="reset" onClick={() => {
                    reset({});

                    showForm({
                        visible: false
                    });
                }} className="flex w-max items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer">
                    <label className={`${koulen.className} text-white text-[1.5em] cursor-pointer`}>Cancel</label>
                </button>
                {options !== undefined &&
                    <button form="webhook-form" disabled={isSubmitting || isDeleting} type="reset" onClick={() => {
                        setDeleting(true);
                    }} className={`flex w-max items-center px-5 py-2 rounded-full bg-blue transition-colors duration-100 ease-linear hover:bg-opacity-80 hover:disabled:bg-opacity-50 disabled:bg-opacity-50 cursor-pointer`}>
                        <span className={`${koulen.className} text-white text-[1.5em] cursor-pointer`}>Delete</span>
                    </button>
                }
            </div>
        </div>
    </div>
}