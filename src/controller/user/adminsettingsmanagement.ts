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
import { AdminSettings } from '../../database/entities/admin_settings';

const adminSettingsRepository=AppDataSource.getRepository(AdminSettings);


export class AdminSettingsController {
//  getapi adminsettings 
 async getAdminSettingsDetails (req: Request, res: Response) {
    try {
      
        const adminSettings = await adminSettingsRepository.findOne({where:{}});

        if (!adminSettings) {
            return ResponseUtil.sendErrror(res,'Admin settings not founds',404,'');
            return;
        }

        return ResponseUtil.sendResponse(res,'All Details AdminSettings',adminSettings);
    } catch (error) {
       
        return ResponseUtil.sendErrror(res,'Internal server error',500,error);
    }
}

}






