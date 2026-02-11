import mongoose from "mongoose";
import { Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

type ResponseData = Record<string, any>;
export const generateOtp = (length: number): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString(); // Random digit between 0 and 9
  }
  return otp;
};


export const connectToDB = () => mongoose.connect(process.env.MONGO_URI);
export const SUCCESS = (
  res: Response,
  status: number,
  message: string,
  data?: ResponseData,
) => {
  // console.log(key)
  return res.status(status).json({
    success: true,
    message,
    data: data || {},
    // data: data || {},
  });
};
export const signToken = (payload: any) => jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
export interface IsendEmail {
  userEmail: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",  
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD);


export const sendEmail = async ({ userEmail, subject, text, html }: IsendEmail) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: userEmail,
    subject: subject,
    text: text,
    html: html
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email: ${error}`);
        reject(error);
      } else {
    
        console.log(`Email sent: ${info.response}`);
        resolve(info.response);
      }
    });
  });
}


export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);
