import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import {
  comparePassword,
  generateOtp,
  hashPassword,
  sendEmail,
  signToken,
  SUCCESS,
} from "../utils/helpers";
import User from "../models/user.model";
import { AccountStatus } from "../utils/enums";
import { IUser } from "../types/user.types";
import {
  findUserByEmail,
  findUserBySocialId,
  userData,
} from "../services/user.service";

const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const {
      firstName = "",
      lastName = "",
      socialId,
      provider,
      email,
      deviceToken,
      deviceType,
    } = req.body;
    let user = await findUserBySocialId(socialId, provider);
    const language = "English";
    const lowercaseEmail = email?.toLowerCase();
    if (!user) {
      user = await findUserByEmail(lowercaseEmail);
      if (user) {
        user.socialLinkedAccounts.push({ provider, id: socialId });
      } else {
        user = new User({
          firstName,
          lastName,
          email: lowercaseEmail,
          socialLinkedAccounts: [{ provider, id: socialId }],
          deviceToken,
          deviceType,
        });
      }
    }
    user.profilePicture = user.profilePicture;
    user.deviceToken = deviceToken ?? null;
    user.deviceType = deviceType ?? null;
    await user.save();

    const userDatas: IUser | null = await User.findById(user._id).select(
      "-password -otp -otpExpiry -jti",
    );
    const token = signToken({ id: user._id });
    return SUCCESS(res, 200, "User logged in successfully", {
      user: { ...userDatas.toObject(), token },
      // token
    });
  } catch (error) {
    console.log("error in socialLogin", error);
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { firstName, lastName, email, password, deviceToken, deviceType } =
      req.body;
    const lowercaseEmail = email?.toLowerCase().trim();
    const existingUser = await findUserByEmail(lowercaseEmail);

    if (existingUser && existingUser.isEmailVerified) {
      return next(new ErrorHandler("User Already Exists", 400));
    }
    const [hashedPassword, otp] = await Promise.all([
      hashPassword(password),
      Promise.resolve(generateOtp(4)),
    ]);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    let user: any;
    try {
      if (existingUser && !existingUser.isEmailVerified) {
        Object.assign(existingUser, {
          lastName,
          firstName,
          password: hashedPassword,
          email: lowercaseEmail,
          otp,
          otpExpiry,
          otpVerified: false,
          updatedAt: new Date(),
          deviceToken,
          deviceType,
        });
        user = await existingUser.save();
      } else {
        user = await User.create({
          firstName,
          lastName,
          email: lowercaseEmail,
          password: hashedPassword,
          otp,
          otpExpiry,
          otpVerified: false,
          deviceToken,
          deviceType,
        });
      }
    } catch (dbError: any) {
      console.log(dbError);
      if (dbError.code === 11000) {
        return next(new ErrorHandler("Email Already Exists", 400));
      }
      return next(new ErrorHandler("Internal Server Error", 400));
    }
    await sendEmail({
      userEmail: lowercaseEmail,
      subject: "Verify Your Account",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Verify Your Account</h2>
      <p>Your one-time verification code is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
    </div>
  `,
    }); // await sendEmail({
    //     userEmail: lowercaseEmail,
    //     subject: 'Verify Your Account',
    //     text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    //     html: verifyOTPTemplate(otp),
    // });
    SUCCESS(res, 200, "OTP sent to your email. Please verify your account.", {
      user: userData(user),
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, otp, type } = req.body; // type can be  1 : 'email' or  2  : 'forgetPassword'
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      throw new ErrorHandler("User Not Found", 404);
    }
    if (user.isEmailVerified && (type === 1 || type == "1")) {
      return SUCCESS(
        res,
        200,
        "This email address has already been verified. You can log in to your account.",
        { user: userData(user) },
      );
    }
    console.log(user?.otp, "expiry...", user?.otpExpiry);
    if (user.otp !== otp) {
      console.log("otp", otp, "userotp..", user.otp);
      console.log("a");
    }
    if (!user.otpExpiry) {
      console.log("b");
    }
    if (user.otpExpiry < new Date()) {
      console.log("c");
    }
    if (user.otp !== otp || !user.otpExpiry) {
      throw new ErrorHandler("Invalid OTP", 400);
    }
    if (user?.otpExpiry < new Date()) {
      throw new ErrorHandler("OTP Expired", 400);
    }
    if (type === 1 || type == "1") {
      user.isEmailVerified = true;
    }
    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;
    user.status = AccountStatus.ACTIVE;
    await user.save();
    let token: string;
    token = signToken({ id: user._id });
    const message =
      type === 1
        ? "Email verified successfully. You can now log in to your account."
        : "OTP verified successfully. You can now reset your password.";
    return SUCCESS(res, 200, message, {
      user: userData(user, token),
      // token,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, password, deviceToken } = req.body;
    const deviceTyp = req?.body?.deviceType;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      throw new ErrorHandler("Email Not Found", 404);
    }
    if (user.status === AccountStatus.SUSPENDED) {
      throw new ErrorHandler("Your account is suspended", 403);
    }
    if (user.password === null || user.password === undefined) {
      throw new ErrorHandler("Wrong Password", 400);
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorHandler("Wrong Password", 400);
    }
    const lowercaseEmail = email?.toLowerCase();
    if (!user.isEmailVerified) {
      const otp = await generateOtp(4);

      await sendEmail({
        userEmail: lowercaseEmail,
        subject: "Verify Your Account",
        text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Verify Your Account</h2>
      <p>Your one-time verification code is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
    </div>
  `,
      });
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
      return SUCCESS(
        res,
        200,
        "OTP sent to your email. Please verify your account.",
        {
          user: userData(user),
          // token
        },
      );
    }
    const token = signToken({ id: user._id, role: user.role });
    await User.findByIdAndUpdate(user._id, {
      deviceToken,
      deviceType: deviceTyp,
    });
    const userDatas: IUser | null = await User.findById(user._id).select(
      "-password -otp -otpExpiry -jti",
    );
    return SUCCESS(res, 200, "User logged in successfully", {
      user: { ...userDatas.toObject(), token },
      // token
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, dob, address, profilePicture } = req.body;
    const userId = req.user?._id;
    const user: IUser = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (dob !== undefined) user.dob = new Date(dob);
    if (address !== undefined) user.address = address;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    await user.save();
    const userData: IUser | null = await User.findById(userId).select(
      "-password -otp -otpExpiry -jti",
    );
    return SUCCESS(res, 200, "Profile updated successfully", {
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.user?._id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    const isOldPasswordCorrect = await comparePassword(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordCorrect) {
      throw new ErrorHandler("Wrong Password", 400);
    }
    const isSameAsPrevious = await comparePassword(newPassword, user.password);
    if (isSameAsPrevious) {
      throw new ErrorHandler(
        "New password must be different from the old password.",
        400,
      );
    }
    const newHashedPassword = await hashPassword(newPassword);
    user.password = newHashedPassword;
    await user.save();
    return SUCCESS(res, 200, "Password changed successfully.", {
      user: userData(user),
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, newPassword } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !user.isEmailVerified) {
      throw new ErrorHandler("User does not exist or email not verified", 400);
    }
    if (!user.otpVerified) {
      throw new ErrorHandler(
        "User does not exist or email not verified hello",
        400,
      );
    }

    const isSamePassword = await comparePassword(newPassword, user.password);

    console.log(isSamePassword, "is same password ");
    if (isSamePassword) {
      throw new ErrorHandler(
        "New Password should not be same as old password",
        400,
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();
    return SUCCESS(res, 200, "Password changed successfully.", {
      user: userData(user),
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email } = req.body;
    const lowercaseEmail = email?.toLowerCase().trim();
    const user = await findUserByEmail(email);
    if (!user || !user.isEmailVerified) {
      throw new ErrorHandler("User does not exist or email not verified", 400);
    }
    const otp = generateOtp(4);
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpVerified = false;
    await user.save();
    await sendEmail({
      userEmail: lowercaseEmail,
      subject: "Password Reset Request",
      text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    });
    return SUCCESS(res, 200, "OTP sent to your email for password reset");
  } catch (error) {
    next(error);
  }
};

const accountLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler("User does not exist or email not verified", 404);
    }
    user.deviceToken = null;
    user.deviceType = null;
    await user.save();

    return SUCCESS(res, 200, "User logged out successfully.", {});
  } catch (error) {
    next(error);
  }
};

const accountDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const language = req.language || "en";
    await User.findByIdAndDelete(req.user._id);
    return SUCCESS(res, 200, "User deleted successfully.", {});
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { email, type } = req.body;
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await findUserByEmail(lowercaseEmail);
    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
    if (type === 1 || type == "1") {
      if (user.isEmailVerified) {
        return next(
          new ErrorHandler("User does not exist or email not verified.", 400),
        );
      }
      const otp = generateOtp(4);
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      user.otpVerified = false;
      await user.save();

      await sendEmail({
        userEmail: lowercaseEmail,
        subject: "Verify Your Account",
        // text: `Your verification code is ${otp}. It expires in 10 minutes.`,
        text: "",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Verify Your Account</h2>
      <p>Your one-time verification code is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
    </div>
  `,
      });

      return SUCCESS(
        res,
        200,
        "OTP resent successfully for email verification",
      );
    }
    if (type === 2) {
      if (!user.isEmailVerified) {
        return next(
          new ErrorHandler("User does not exist or email not verified.", 400),
        );
      }
      const otp = generateOtp(4);
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      user.otpVerified = false;
      await user.save();

      await sendEmail({
        userEmail: lowercaseEmail,
        subject: "Password Reset Request",
        text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
      });
      return SUCCESS(res, 200, "OTP resent successfully for password reset");
    }
    return next(new ErrorHandler("INVALID TYPE", 400));
  } catch (error) {
    console.log("errorrrr..l.", error);
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new ErrorHandler("Unauthorized", 401);

    const user: IUser | null = await User.findById(userId).select(
      "-password -otp -otpExpiry -jti",
    );
    if (!user) throw new ErrorHandler("User not found", 404);
    return SUCCESS(res, 200, "Profile fetched successfully", { user });
  } catch (error) {
    next(error);
  }
};

export const getUserStatsProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const filteredData: any = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };
    return res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== undefined) {
      filter.role = Number(role);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -otp -otpExpiry -jti")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return SUCCESS(res, 200, "Users fetched successfully", {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { userId, role } = req.body;

    if (role === undefined) {
      return next(new ErrorHandler("Role is required", 400));
    }

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.role = Number(role);
    await user.save();

    return SUCCESS(res, 200, "User role updated successfully", {
      user: userData(user),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  verifyUserEmail,
  loginUser,
  updateProfile,
  changePassword,
  resetPassword,
  forgetPassword,
  accountLogout,
  accountDelete,
  socialLogin,
  resendOtp,
  getProfile,
  getUserStatsProfile,
  getAllUsers,
  changeUserRole,
};
