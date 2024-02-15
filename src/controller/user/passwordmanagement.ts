import { Request, Response } from 'express';
import { And, createQueryBuilder, getRepository } from 'typeorm';
import { User } from '../../database/entities/User';
import { City } from '../../database/entities/City';
import { UserAddress } from '../../database/entities/User_address';
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { AuthClient } from '../../database/entities/auth_client';
import { AuthToken } from '../../database/entities/auth_token';
import { OTP_VERFIY } from '../../database/entities/opt_verfiy';
import { generateOTP } from '../../utils/functions';
import { generateJwtToken } from '../../utils/functions';
import { OtpUse } from '../../constant';
import { UserVerfiy } from '../../constant';
// Add other imports and functions
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
// declare global
const userRepository = AppDataSource.getRepository(User);
const authClientRepository = AppDataSource.getRepository(AuthClient);
const deviceTokenRepository = AppDataSource.getRepository(AuthToken);
const otpverfiyRepository = AppDataSource.getRepository(OTP_VERFIY);

// golbal declare
const OTP_LENGTH: number = parseInt(process.env.OTPLENGTH || '6', 10);


export class UserPasswordManagementController {

    // create newpassword api
    async createNewPassword(req: Request, res: Response) {
        try {
            const { app_id, app_secret, email, newPassword } = req.body;

            // Check if the auth client exists or not
            const authClient = await authClientRepository.findOne({ where: { app_id, app_secret } });

            if (!authClient) {
                return ResponseUtil.sendErrror(res, 'Invalid authentication client', 401, 'Invalid authentication client');
            }

            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return ResponseUtil.sendErrror(res, 'Invalid User', 401, 'Invalid User');
            }

            const saltRounds = 4;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await userRepository.save(user);

            return ResponseUtil.sendResponse(res, 'Create new password successfully', hashedPassword);
        } catch (error) {
            return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
        }
    }



}

