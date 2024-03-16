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
import { Deleted_Status } from '../../constant';
// declare global
const userRepository = AppDataSource.getRepository(User);
const userAddressRepository = AppDataSource.getRepository(UserAddress);
const authClientRepository = AppDataSource.getRepository(AuthClient);
const otpverfiyRepository = AppDataSource.getRepository(OTP_VERFIY);
const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cityRepository = AppDataSource.getRepository(City);
const stateRepository = AppDataSource.getRepository(State);
const countryRepository = AppDataSource.getRepository(Country);

// golbal declare
const OTP_LENGTH: number = parseInt(process.env.OTPLENGTH || '6', 10);

export class UserSignupController {
    // signup user api mobile app site 
    async signup(req: Request, res: Response) {
        let newZipcode;
        try {
            const {
                app_id,
                app_secret,
                first_name,
                last_name,
                phone,
                email,
                address_line_1,
                address_line_2,
                zipcode,
                city,
                state,
                country,
                password,
                role,
                food_type,
            } = req.body;

            const authClient = await authClientRepository.findOne({ where: { app_id, app_secret } });

            if (role === Roles.USER && app_id !== authClient?.app_id && app_secret !== authClient?.app_secret) {
                return ResponseUtil.sendErrror(res, 'Invalid app credentials for user role', 401, 'Invalid app credentials');
            }

            const existingUserByEmail = await userRepository.findOne({ where: { email } });
            if (existingUserByEmail) {
                return ResponseUtil.sendErrror(res, 'This account already exists', 401, 'Please check your email');
            }
            const existingUserByPhone = await userRepository.findOne({ where: { phone } });
            if (existingUserByPhone) {
                return ResponseUtil.sendErrror(res, 'This account already exists', 401, 'Please check your phone');
            }

            let zipCodeId: any;

            let existingZipCode = await zipcodeRepository.findOne({ where: { zipcode } });

            if (!existingZipCode) {
                // Check if the city exists within the state
                let existingCity = await cityRepository.findOne({ where: { name: city } });

                if (!existingCity) {
                    // Check if the state exists within the country
                    let existingState = await stateRepository.findOne({ where: { name: state } });

                    if (!existingState) {
                        let existingCountry = await countryRepository.findOne({ where: { name: country } });

                        if (!existingCountry) {
                            const newCountry = await addnewcountry(country);
                            const newstate = await addnewstate(state, newCountry.id);
                            const newcity = await addnewcity(city, newstate.id)
                            newZipcode = await addnewzipcode(zipcode, newcity.id)
                        } else {
                            const newstate = await addnewstate(state, existingCountry.id);
                            const newcity = await addnewcity(city, newstate.id)
                            newZipcode = await addnewzipcode(zipcode, newcity.id)
                        }
                    } else {
                        const newcity = await addnewcity(city, existingState.id)
                        newZipcode = await addnewzipcode(zipcode, newcity.id)
                    }
                } else {
                    newZipcode = await addnewzipcode(zipcode, existingCity.id);
                }

                zipCodeId = newZipcode.id
            } else {
                zipCodeId = existingZipCode.id
            }

            const saltRounds = 4;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User();
            user.firstName = first_name;
            user.lastName = last_name;
            user.phone = phone;
            user.email = email;
            user.password = hashedPassword;
            user.role = role;
            user.food_type = food_type;

            const userdata = await userRepository.save(user);

            const userAddress = new UserAddress();
            userAddress.address_line_1 = address_line_1;
            userAddress.address_line_2 = address_line_2;
            userAddress.zipcode = zipCodeId;
            userAddress.user = user;

            await userAddressRepository.save(userAddress);

            const userotp = generateOTP(OTP_LENGTH);

            const otpverfiyData = new OTP_VERFIY();
            otpverfiyData.user_id = userdata.id;
            otpverfiyData.otp = userotp;
            otpverfiyData.expired_on = new Date(Date.now() + 10 * 60 * 1000);

            await otpverfiyRepository.save(otpverfiyData);
            const emailSent = await sendOtpByEmail(
                email,
                'OTP for account verification',
                `
                    <p>Dear User,</p>
                    <p> OTP for account verification is: <strong>${userotp}</strong></p>
                    <p>Please use this OTP to verify your account.</p>
                    <p>Thank you.</p>
                `
            );

            if (emailSent) {
                return ResponseUtil.sendResponse(res, 'OTP Sent via Email', { otp: userotp, userData: userdata });
            } else {
                return ResponseUtil.sendErrror(res, 'Failed to send OTP via email', 403, 'Email sending failed');
            }


        } catch (error) {
            console.log(error)
            return ResponseUtil.sendErrror(res, 'Internal server error', 500, "Internal server error");
        }
    }



      // DeleteByUserId ApI
  async deleteUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return ResponseUtil.sendErrror(
          res,
          "User not found",
          404,
          "User not found"
        );
      }

      user.is_deleted = Deleted_Status.DELETED;

      await userRepository.save(user);

      return ResponseUtil.sendResponse(res, "User deleted successfully", user);
    } catch (error) {
      return ResponseUtil.sendErrror(
        res,
        "Failed to delete user",
        500,
        "Internal server error"
      );
    }
  }

}






