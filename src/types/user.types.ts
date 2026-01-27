import { Document } from "mongoose";
import { IPersonalBest } from "./mongo.types";

export interface ISocialLinkedAccount {
    provider: 1 | 2;
    id: string;
}

export interface IUser extends Document {
    personalBest:IPersonalBest
    skin:string,
    statVisibility?: {
        showTimeTricking?:boolean
        showTrickingLevel?: boolean;
        showFavouriteTrick?: boolean;
        showBestTrick?: boolean;
        showPBs?: boolean;
        showTimeSubscribed?: boolean;
        showMostPracticedTrick?:boolean
    };
    bestTrick?:string
    favouriteTrick?:string
    phone?: string;
    countryCode?: string;
    profilePicture?: string;
    status?: string;
    address: string,
    name?: string;
    // lastName?: string
    dob?: Date;
    isEmailVerified?: boolean;
    role?: number;
    lastOtpSentAt?: Date;
    preferredLanguage?: string
    bio?: string;
    socialLinkedAccounts?: ISocialLinkedAccount[];
    email?: string;
    password?: string;
    language?: string;
    location?: {
        type: "Point";
        coordinates: [number, number];
    };
    stripeId?: string,
    deviceToken?: string;
    deviceType?: 1;
    jti?: string;
    otp?: string;
    otpExpiry?: Date;
    otpVerified?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    subscriptionId?: string;
    matchPassword(password: string): Promise<boolean>;
    trickingNickname?: string
    country?: string;
    timeTricking?: string;
    signatureTrick?: string;
    dreamTrick: string;
    instagramLink?: string;
    tiktockLink?: string;
    youtubeLink?: string
    notificationAlert?: boolean
    sesionReminderAlert?: boolean
    newVideoAlert?: boolean;
    clipReviews?:number
}