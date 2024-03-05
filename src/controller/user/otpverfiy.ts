import { Request, Response } from 'express';
import { And, createQueryBuilder, getRepository } from 'typeorm';
import { User } from '../../database/entities/User';
import { City } from '../../database/entities/City';
import { UserAddress } from '../../database/entities/User_address';
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { DatabaseTables, Roles } from '../../constant';
import { formatDate } from '../../utils/functions';
import { Zipcode } from '../../database/entities/Zipcode';
import { Deleted_Status } from '../../constant';
import { Status } from '../../constant';
import { Kitchen } from '../../database/entities/Kitchen';
import { KitchenPhotos } from '../../database/entities/Kitchen_Photos';
import { Cuisine } from '../../database/entities/Cuisine';
import { Tag } from '../../database/entities/Tags';
import { ChefTag } from '../../database/entities/Chef_Tags';
import { Paginator } from '../../database/Paginator';
import { PaginationInfo } from '../../database/Paginator';
import { ChefCuisine } from '../../database/entities/Chef_Cuisine';
import { AuthClient } from '../../database/entities/auth_client';
import { AuthToken } from '../../database/entities/auth_token';
import { OTP_VERFIY } from '../../database/entities/opt_verfiy';
import { generateOTP } from '../../utils/functions';
import { generateJwtToken } from '../../utils/functions';
import { OtpUse } from '../../constant';
import { UserVerfiy } from '../../constant';
import { OtpVerificationType } from '../../constant';
import { sendOtpByEmail } from '../../utils/functions';

// Add other imports and functions
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
// declare global

const otpLength: number = parseInt(process.env.OTPLENGTH || '6', 10);
const userRepository = AppDataSource.getRepository(User);
const userAddressRepository = AppDataSource.getRepository(UserAddress);
const kitchenRepository = AppDataSource.getRepository(Kitchen);
const kitchenPhotosRepository = AppDataSource.getRepository(KitchenPhotos);
const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cuisineRepository = AppDataSource.getRepository(Cuisine);
const tagReposityoy = AppDataSource.getRepository(Tag);
const cheftagRepositroy = AppDataSource.getRepository(ChefTag);
const chefcuisineRepositroy = AppDataSource.getRepository(ChefCuisine);
const authClientRepository = AppDataSource.getRepository(AuthClient);
const deviceTokenRepository = AppDataSource.getRepository(AuthToken);
const otpverfiyRepository = AppDataSource.getRepository(OTP_VERFIY);

export class UserOtpVerifyController {


    // OTP Verification API

    async verifyOTP(req: Request, res: Response) {
        try {
            const { app_id, app_secret, otp, userId, verifaction_type } = req.body;

            // Check if the auth client exists or not
            const authClient = await authClientRepository.findOne({ where: { app_id, app_secret } });

            if (!authClient) {
                return ResponseUtil.sendErrror(res, 'Invalid auth client', 401, '');
            }

            // Check if the verification type is valid
            if (!(verifaction_type in OtpVerificationType)) {
                return ResponseUtil.sendErrror(res, 'Invalid verification type', 400, '');
            }

            const otpDetails = await otpverfiyRepository.findOne({
                where: { user_id: userId, status: Status.ACTIVE },
                order: { created_on: 'DESC' },
            });

            // Check if OTP is correct and not expired
            if (otpDetails && otpDetails.otp === otp && otpDetails.expired_on > new Date()) {
                if (otpDetails.is_used === OtpUse.USED) {
                    return ResponseUtil.sendErrror(res, "OTP has already been used", 401, "OTP has already been used");
                }

                // OTP is verified successfully, generate token only for SIGNUP verification type
                if (verifaction_type === OtpVerificationType.SIGNUP) {
                    const token = generateJwtToken(userId);

                    const newOtpVerifyToken = new AuthToken();
                    newOtpVerifyToken.access_token = token;
                    newOtpVerifyToken.user_id = userId;

                    // Update OTP status to used
                    otpDetails.is_used = OtpUse.USED;
                    otpDetails.status = Status.INACTIVE;
                    await otpverfiyRepository.save(otpDetails);

                    await deviceTokenRepository.save(newOtpVerifyToken);

                    // Update user account verification status in the database 
                    const user = await userRepository.findOne({ where: { id: userId } });
                    if (user) {
                        user.is_verified = UserVerfiy.VERFIED;

                        await userRepository.save(user);
                        // Update OTP status to used
                        otpDetails.is_used = OtpUse.USED;
                        otpDetails.status = Status.INACTIVE;
                        await otpverfiyRepository.save(otpDetails);

                        return ResponseUtil.sendResponse(res, "Token generated for SIGNUP verification", { token });
                    } else {
                        return ResponseUtil.sendErrror(res, "User not found", 404, "User not found");
                    }
                } else {

                    const user = await userRepository.findOne({ where: { id: userId } });
                    if (user) {
                        user.is_verified = UserVerfiy.VERFIED;
                        await userRepository.save(user);

                        return ResponseUtil.sendResponse(res, "Verification successful for the Forgot password", "Verification successful");
                    } else {
                        return ResponseUtil.sendErrror(res, "User not found", 404, "User not found");
                    }
                }
            } else {
                return ResponseUtil.sendErrror(res, "Invalid OTP", 401, "Invalid OTP");
            }
        } catch (error) {
            return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
        }
    }


    // resendOtp api
    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;

            // Find user by email
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return ResponseUtil.sendErrror(res, 'User not found', 404, 'User not found');
            }

            // Deactivate any existing OTP records associated with the user
            const existingOtpRecords = await otpverfiyRepository.find({ where: { user_id: user.id ,status:Status.ACTIVE} });

            for (const existingOtpRecord of existingOtpRecords) {
                existingOtpRecord.status = Status.INACTIVE;
                await otpverfiyRepository.save(existingOtpRecord);
            }

            // Generate a new OTP
            const newOtp = generateOTP(otpLength);

            const newOtpRecord = new OTP_VERFIY();
            newOtpRecord.user_id = user.id;
            newOtpRecord.otp = newOtp;
            newOtpRecord.expired_on = new Date(Date.now() + 10 * 60 * 1000);
            await otpverfiyRepository.save(newOtpRecord);

            // Send the new OTP via email using the sendEmail function
            const emailSent = await sendOtpByEmail(
                email,
                'New OTP for verification',
                `
              <p>Dear User,</p>
              <p>Your new OTP for verification is: <strong>${newOtp}</strong></p>
              <p>Please use this OTP to verify</p>
              <p>Thank you.</p>
            `
            );

            if (emailSent) {
                return ResponseUtil.sendResponse(res, ' OTP Sent via Email', { newOtp });
            } else {
                return ResponseUtil.sendErrror(res, 'Failed to send new OTP via email', 403, 'Email sending failed');
            }

        } catch (error) {
            console.log(error);
            return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
        }
    }


}


