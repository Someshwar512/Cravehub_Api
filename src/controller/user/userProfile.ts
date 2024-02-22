import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { Roles } from '../../constant';
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../database/entities/User';
import { UserAddress } from '../../database/entities/User_address';
import { OTP_VERFIY } from '../../database/entities/opt_verfiy';
import { generateOTP } from '../../utils/functions';
import { AuthClient } from '../../database/entities/auth_client';
import { Zipcode } from '../../database/entities/Zipcode';
import { City } from '../../database/entities/City';
import { State } from '../../database/entities/State';
import { Country } from '../../database/entities/Country';
import { Status } from '../../constant';
import { sendOtpByEmail } from '../../utils/functions';
import { addnewcountry, addnewstate, addnewcity, addnewzipcode } from "../../utils/functions";

// declare global
const userRepository = AppDataSource.getRepository(User);
const userAddressRepository = AppDataSource.getRepository(UserAddress);
const authClientRepository = AppDataSource.getRepository(AuthClient);
const otpverfiyRepository = AppDataSource.getRepository(OTP_VERFIY);
const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cityRepository = AppDataSource.getRepository(City);
const stateRepository = AppDataSource.getRepository(State);
const countryRepository = AppDataSource.getRepository(Country);
   // Fetch user from database
//    const userRepository = AppDataSource.getRepository(User);
// golbal declare
const OTP_LENGTH: number = parseInt(process.env.OTPLENGTH || '6', 10);

export class UserProfileController {
   
    async updateProfile(req: Request, res: Response) {
        try {
          
            const userId = parseInt(req.params.userId, 10);

            const user = await userRepository.findOne({where:{id:userId}});

            if (!user) {
                return ResponseUtil.sendErrror(res, "User not found",400,'');
            }

            // Update user profile information
            if (req.body.name) {
                user.getFullName = req.body.name;
            }
            // Add more fields as needed

            // Save updated user
            await userRepository.save(user);

            // Respond with success
            return ResponseUtil.sendResponse(res, "User profile updated successfully", user);
        } catch (error) {
            console.error("Error updating user profile:", error);
            return ResponseUtil.sendErrror(res, "Internal server error",500,error);
        }
    }


}






