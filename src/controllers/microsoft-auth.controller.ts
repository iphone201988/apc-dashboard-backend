import { NextFunction, Request, Response } from "express";
import axios from "axios";
import ErrorHandler from "../utils/errorHandler";
import { signToken, SUCCESS } from "../utils/helpers";
import User from "../models/user.model";
import { IUser } from "../types/user.types";
import { SocialLoginType } from "../utils/enums";

/**
 * Microsoft OAuth Login
 * Handles authentication via Microsoft Azure AD
 */
const microsoftLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { accessToken, email, firstName, lastName, microsoftId } = req.body;

        if (!accessToken || !email || !microsoftId) {
            return next(new ErrorHandler("Missing required fields", 400));
        }

        const lowercaseEmail = email.toLowerCase().trim();

        // Find user by Microsoft ID or email
        let user = await User.findOne({
            $or: [
                { "socialLinkedAccounts.id": microsoftId },
                { email: lowercaseEmail }
            ]
        });

        if (!user) {
            // Create new user
            user = new User({
                firstName: firstName || "",
                lastName: lastName || "",
                email: lowercaseEmail,
                isEmailVerified: true, // Microsoft emails are pre-verified
                socialLinkedAccounts: [{ provider: SocialLoginType.MICROSOFT as 1 | 2 | 3, id: microsoftId }],
            });
        } else {
            // Update existing user with Microsoft account if not already linked
            const hasMicrosoftLinked = user.socialLinkedAccounts.some(
                (account) => account.id === microsoftId
            );

            if (!hasMicrosoftLinked) {
                user.socialLinkedAccounts.push({ provider: SocialLoginType.MICROSOFT as 1 | 2 | 3, id: microsoftId });
            }

            // Update user info if needed
            if (firstName && !user.firstName) user.firstName = firstName;
            if (lastName && !user.lastName) user.lastName = lastName;
            user.isEmailVerified = true;
        }

        await user.save();

        // Get user data without sensitive fields
        const userDatas: IUser | null = await User.findById(user._id).select(
            "-password -otp -otpExpiry -jti"
        );

        // Generate JWT token
        const token = signToken({ id: user._id, role: user.role });

        return SUCCESS(res, 200, "User logged in successfully", {
            user: { ...userDatas!.toObject(), token },
        });
    } catch (error) {
        console.log("error in microsoftLogin", error);
        next(error);
    }
};

/**
 * Verify Microsoft Token
 * Validates the Microsoft access token with Microsoft Graph API
 */
const verifyMicrosoftToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return next(new ErrorHandler("Access token is required", 400));
        }

        // Verify token with Microsoft Graph API
        const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { id, mail, givenName, surname, userPrincipalName } = response.data;

        return SUCCESS(res, 200, "Token verified successfully", {
            microsoftId: id,
            email: mail || userPrincipalName,
            firstName: givenName,
            lastName: surname,
        });
    } catch (error: any) {
        console.log("error in verifyMicrosoftToken", error);
        if (error.response?.status === 401) {
            return next(new ErrorHandler("Invalid or expired token", 401));
        }
        next(error);
    }
};

/**
 * Get User Profile
 * Returns the authenticated user's profile
 */
const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        const user = await User.findById(userId).select(
            "-password -otp -otpExpiry -jti"
        );

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        return SUCCESS(res, 200, "Profile fetched successfully", { user });
    } catch (error) {
        console.log("error in getProfile", error);
        next(error);
    }
};

export default {
    microsoftLogin,
    verifyMicrosoftToken,
    getProfile,
};
