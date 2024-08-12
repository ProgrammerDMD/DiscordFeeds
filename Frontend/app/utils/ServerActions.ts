"use server";

import { lucia, validateRequest } from "../auth";
import { errors } from "./Utils";
import { cancelSubscription as cancelSubscriptionDB, cancelUserDeletion, deleteUser, upgradeUser } from "../components/backend/database";
import { resumeSubscription as resumeSubscriptionDB } from "../components/backend/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const { session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}

export async function cancelUserDeletionDB(): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;
    if (!user.deleting) return errors.custom("Your account is not being deleted.");

    cancelUserDeletion(user.id);
}

export async function deleteUserDB(): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;
    if (user.deleting) return errors.custom("Your account is already in the process of deletion.");

    deleteUser(user.id);
}

export async function upgradeUserDB(transactionId: string): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;
    if (user.deleting) return errors.custom("Your account is in the process of deletion.");

    upgradeUser(user.id, transactionId);
}

export async function processTransaction(transaction_id: string | undefined) {
    console.log(transaction_id);
}

export async function cancelSubscription(): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;

    await cancelSubscriptionDB(user.id);
}

export async function resumeSubscription(): Promise<void | { message: string }> {
    const { user, session } = await validateRequest();
    if (!session) return errors.NOT_LOGGED_IN;
    if (user.deleting) return errors.custom("Your account is in the process of deletion.");

    await resumeSubscriptionDB(user.id);
}

export async function getChannel(url: string | undefined): Promise<string> {
    const response = await fetch(`${process.env.API_URL}/youtube/url`, {
        method: "POST",
        next: {
            revalidate: 15 * 60
        },
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url
        })
    });

    if (response.status === 404) {
        return Promise.reject(errors.custom("The specified channel hasn't been found!"));
    }

    if (!response.ok) return Promise.reject(errors.SERVER_UNKNOWN_ERROR);
    const body = await response.json();
    
    return Promise.resolve(body.externalId);
}