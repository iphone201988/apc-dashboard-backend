import Joi from "joi";

export const registerSchema = {
    body: Joi.object({
        // name: Joi.string().trim().min(2).max(50).required().messages({
        //     "string.empty": "Name is required",
        //     "string.min": "Name must be at least 2 characters long",
        //     "any.required": "Name is required",
        // }),

        // dob: Joi.date().iso().less("now").required().messages({
        //     "date.base": "Date of birth must be a valid date",
        //     "date.less": "Date of birth must be in the past",
        //     "any.required": "Date of birth is required",
        // }),

        email: Joi.string().trim().lowercase().email().required().messages({
            "string.email": "Invalid email address",
            "any.required": "Email is required",
        }),

        password: Joi.string()
            .min(6)
            .max(128)
            .required()
            .messages({
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 128 characters",
                "any.required": "Password is required",
            }),

        deviceToken: Joi.string().optional().allow(null, ""),
        deviceType: Joi.string()
            .valid("1", "2")
            .optional()
            .messages({
                "any.only": "Device type must be one of ios, android, or web",
            }),

        // phone: Joi.string()
        //     .pattern(/^[0-9]{6,15}$/)
        //     .required()
        //     .messages({
        //         "string.pattern.base": "Phone number must contain 6–15 digits",
        //         "any.required": "Phone number is required",
        //     }),

        // countryCode: Joi.string()
        //     .pattern(/^\+\d{1,4}$/)
        //     .required()
        //     .messages({
        //         "string.pattern.base": "Country code must start with '+' followed by 1–4 digits",
        //         "any.required": "Country code is required",
        //     }),
    })
};

export const verifyUserEmailSchema = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.email": "Invalid email address",
            "any.required": "Email is required",
        }),

        otp: Joi.string()
            .pattern(/^\d{4,6}$/)
            .required()
            .messages({
                "string.pattern.base": "OTP must be a 4–6 digit number",
                "any.required": "OTP is required",
            }),

        type: Joi.alternatives()
            .try(Joi.number().valid(1, 2), Joi.string().valid("1", "2"))
            .required()
            .messages({
                "any.only": "Type must be 1 (email verification) or 2 (forgot password)",
                "any.required": "Type is required",
            }),
    })
};


export const loginSchema = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.email": "Invalid email address",
            "any.required": "Email is required",
        }),

        password: Joi.string().min(6).max(128).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "string.max": "Password cannot exceed 128 characters",
            "any.required": "Password is required",
        }),

        deviceType: Joi.string()
            .valid("1", "2")
            .optional()
            .messages({
                "any.only": "Device type must be one of ios, android, or web",
            }),

        deviceToken: Joi.string().optional().allow(null, "").messages({
            "string.base": "Device token must be a string",
        }),

    })
};



export const updateProfileSchema = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(50).optional().messages({
            "string.min": "Name must be at least 2 characters long",
            "string.max": "Name cannot exceed 50 characters",
        }),
        skin: Joi.string().trim().min(2).max(50).optional().messages({
            "string.min": "skin must be at least 2 characters long",
            "string.max": "skin cannot exceed 50 characters",
        }),

        dob: Joi.date().iso().less("now").optional().messages({
            "date.base": "Date of birth must be a valid date",
            "date.less": "Date of birth must be in the past",
        }),

        bio: Joi.string().max(500).optional().allow("", null).messages({
            "string.max": "Bio cannot exceed 500 characters",
        }),

        address: Joi.string().max(200).optional().allow("", null).messages({
            "string.max": "Address cannot exceed 200 characters",
        }),

        profilePicture: Joi.string().optional().allow("", null).messages({
            "string.uri": "Profile picture must be a valid URL",
        }),

        location: Joi.object({
            latitude: Joi.number().min(-90).max(90).required().messages({
                "number.base": "Latitude must be a number",
                "number.min": "Latitude cannot be less than -90",
                "number.max": "Latitude cannot be greater than 90",
                "any.required": "Latitude is required when location is provided",
            }),
            longitude: Joi.number().min(-180).max(180).required().messages({
                "number.base": "Longitude must be a number",
                "number.min": "Longitude cannot be less than -180",
                "number.max": "Longitude cannot be greater than 180",
                "any.required": "Longitude is required when location is provided",
            }),
        })
            .optional()
            .messages({
                "object.base": "Location must be an object with latitude and longitude",
            }),

        trickingNickname: Joi.string().trim().max(50).optional().allow("", null).messages({
            "string.max": "Tricking nickname cannot exceed 50 characters",
        }),

        country: Joi.string().trim().max(100).optional().allow("", null).messages({
            "string.max": "Country name cannot exceed 100 characters",
        }),

        timeTricking: Joi.string()
            .trim()
            .max(50)
            .optional()
            .allow("", null)
            .messages({
                "string.max": "Time tricking value cannot exceed 50 characters",
            }),

        signatureTrick: Joi.string().trim().max(100).optional().allow("", null).messages({
            "string.max": "Signature trick cannot exceed 100 characters",
        }),

        dreamTrick: Joi.string().trim().max(100).optional().allow("", null).messages({
            "string.max": "Dream trick cannot exceed 100 characters",
        }),
        bestTrick: Joi.string().trim().max(100).optional().allow("", null).messages({
            "string.max": "bestTrick cannot exceed 100 characters",
        }),
        favouriteTrick: Joi.string().trim().max(100).optional().allow("", null).messages({
            "string.max": "bestTrick cannot exceed 100 characters",
        }),

        instagramLink: Joi.string().optional().allow("", null).messages({
            "string.uri": "Instagram link must be a valid URL",
        }),

        tiktockLink: Joi.string().optional().allow("", null).messages({
            "string.uri": "TikTok link must be a valid URL",
        }),

        youtubeLink: Joi.string().optional().allow("", null).messages({
            "string.uri": "YouTube link must be a valid URL",
        }),
        notificationAlert: Joi.boolean().optional(),
        sesionReminderAlert: Joi.boolean().optional(),
        newVideoAlert: Joi.boolean().optional(),
        gainerSwitch: Joi.number().optional(),
        corks: Joi.number().optional(),

        showTrickingLevel: Joi.boolean().optional(),
        showFavouriteTrick: Joi.boolean().optional(),
        showBestTrick: Joi.boolean().optional(),
        showPBs: Joi.boolean().optional(),
        showTimeTricking: Joi.boolean().optional(),
        showMostPracticedTrick: Joi.boolean().optional(),
        showTimeSubscribed: Joi.boolean().optional(),

    }),
};



export const changePasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().min(6).max(128).required().messages({
            "string.empty": "Old password is required",
            "string.min": "Old password must be at least 6 characters long",
            "string.max": "Old password cannot exceed 128 characters",
            "any.required": "Old password is required",
        }),

        newPassword: Joi.string()
            .min(6)
            .max(128)
            .disallow(Joi.ref("oldPassword"))
            .required()
            .messages({
                "string.empty": "New password is required",
                "string.min": "New password must be at least 6 characters long",
                "string.max": "New password cannot exceed 128 characters",
                "any.required": "New password is required",
                "any.invalid": "New password must be different from old password",
            }),
    })
};





export const forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.email": "Invalid email address",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),
    })
};




export const resendOtpSchema = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required().messages({
            "string.email": "Invalid email address",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),

        type: Joi.alternatives()
            .try(Joi.number().valid(1, 2), Joi.string().valid("1", "2"))
            .required()
            .messages({
                "any.only": "Type must be 1 (email verification) or 2 (password reset)",
                "any.required": "Type is required",
            }),
    })
};



export const resetPasswordSchema = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Please provide a valid email address",
                "any.required": "Email is required",
            }),

        newPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "New password is required",
                "string.min": "Password must be at least 8 characters long",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                "any.required": "New password is required",
            }),

    })
};



export const socialLoginSchema = {
    body: Joi.object({
        socialId: Joi.string().trim().required().messages({
            "any.required": "Social ID is required",
            "string.base": "Social ID must be a string",
            "string.empty": "Social ID cannot be empty",
        }),

        provider: Joi.string()
            .valid("1", "2")
            .required()
            .messages({
                "any.only": "Provider must be one of: 1,2",
                "any.required": "Provider is required",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Email must be a valid email address",
                "any.required": "Email is required",
            }),
        name: Joi.string()
            .allow(null, "")
            .optional()
            .messages({
                "string.base": "name must be a string",
            }),
        deviceToken: Joi.string()
            .allow(null, "")
            .optional()
            .messages({
                "string.base": "Device token must be a string",
            }),

        deviceType: Joi.string()
            .valid("1", "2") // adjust based on your logic
            .required()
            .messages({
                "any.only": "Device type must be one of: 1, 2",
                "any.required": "Device type is required",
            }),
    }),
};