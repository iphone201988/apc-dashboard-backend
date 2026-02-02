import { Schema, model } from "mongoose";
import { IUser } from "../types/user.types";
import { AccountStatus, deviceType, roleType, SocialLoginType } from "../utils/enums";

const userSchema = new Schema<IUser>(
    {
        phone: { type: String },
        countryCode: { type: String },
        profilePicture: { type: String },
        isEmailVerified: { type: Boolean, default: false },
        socialLinkedAccounts: [{ provider: { type: Number, enum: [SocialLoginType.APPLE, SocialLoginType.GOOGLE] }, id: { type: String } }],
        email: { type: String },
        password: { type: String },
        language: {
            type: String,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],           // [lng, lat]
            }
        },
        address: {
            type: String
        },
        bio: { type: String },
        lastOtpSentAt: { type: Date },
        deviceToken: { type: String },
        deviceType: { type: Number, enum: [deviceType.ANDROID, deviceType.IOS] },
        jti: { type: String },
        otp: { type: String },
        otpExpiry: { type: Date },
        otpVerified: { type: Boolean },
        isDeleted: { type: Boolean, default: false },
        stripeId: { type: String },
        subscriptionId: {
            type: String,
            ref: 'Subscription',
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        preferredLanguage: {
            type: String
        },
        dob: { type: Date },
        status: {
            type: String,
            enum: Object.values(AccountStatus),
            default: "active",
        },
        country: {
            type: String,
        },
        notificationAlert: {
            type: Boolean,
            default: true
        },
        role:{
            type:Number,
            default:roleType.USER,
            enum:roleType
        }


    },
    { timestamps: true }
);
const User = model<IUser>("User", userSchema);

export default User;
