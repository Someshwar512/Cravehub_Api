// DateUtils.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../database/entities/User';
import { AppDataSource } from '../database/data-source';
// import { DeviceToken } from '../database/entities/Device_Token';
import { AuthToken } from '../database/entities/auth_token';
import { Roles } from '../constant';
import { ResponseUtil } from "../utils/Response";
import jwt from 'jsonwebtoken';
import { City } from '../database/entities/City';
import { Country } from '../database/entities/Country';
import { State } from '../database/entities/State';
import { Zipcode } from '../database/entities/Zipcode';
import { format, parse } from 'date-fns';
import nodemailer from 'nodemailer';
import { ChefMenu } from '../database/entities/chef_menu';
import { DatabaseTables } from '../constant';
const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cityRepository = AppDataSource.getRepository(City);
const stateRepository = AppDataSource.getRepository(State);
const countryRepository = AppDataSource.getRepository(Country);
const  chefMenuRepository=AppDataSource.getRepository(ChefMenu);

// this functions time and data chnage formate


export const formatDate = (datetime: Date): string => {
    const dateObject = new Date(datetime);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(dateObject);
    return formattedDate;
};



// this is functions user authenticate
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    console.log(req)
    const tokenData = req.headers['authorization']?.split(" ");
    const token = tokenData?.at(1);
  
    if (!token) {
      return ResponseUtil.sendErrror(res, "Token not provided", 401, "Token not provided");
    }
    jwt.verify(token, process.env.SECRET_KEY as string, (err: any, decoded: any) => {
      if (err) {
        return ResponseUtil.sendErrror(res, "Unauthorized: Invalid token", 403,"Invalid token");
      }
  
      (req as any).user = decoded;
      global.USER_ID = decoded.user_id
      next();
    });
  };



  export  const addnewzipcode = async (zipcode,cityId) => {
    const newZipcode = zipcodeRepository.create({ zipcode: zipcode, city: cityId});
    await zipcodeRepository.save(newZipcode);
    return newZipcode;
  }

  export  const addnewcity = async (city,stateId) => {
    const newcity = cityRepository.create({ name: city, state: stateId});
    await cityRepository.save(newcity);
    return newcity;
  }

  export  const addnewstate = async (state,countryId) => {
    const newstate = stateRepository.create({ name: state, country: countryId});
    await stateRepository.save(newstate);
    return newstate;
  }

  export  const addnewcountry = async (country) => {
    const newCountry = countryRepository.create({ name: country});
    await countryRepository.save(newCountry);
    return newCountry;
  }


 
    export const generateJwtToken = (userId: number): string => {
      const token = jwt.sign({ user_id: userId }, process.env.SECRET_KEY as string, { expiresIn: process.env.TOKEN_EXPIRATION_DAYS });
      return token;
  };



  // Function to convert time in HH:mm format to minutes
export const convertTimeToMinutes = (timeString: string): number | null => {
  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return null; // Invalid time format
  }
  return hours * 60 + minutes;
};



    // Generate OTP function
    export function generateOTP(otpLength: number): string {
      const min = Math.pow(10, otpLength - 1);
      const max = Math.pow(10, otpLength) - 1;
      const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
      return otp;
    }

// sendemail common functions

export const  sendOtpByEmail = (to: string, subject: string, body: string)=> {
  try {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAILID,
              pass: process.env.PASSWORD,
          },
      });

      const mailOptions = {
          from: process.env.EMAILID,
          to,
          subject,
          body,
      };

      const info = transporter.sendMail
      console.log('Email sent: ', info);

      return true;
  } catch (error) {
      console.error('Error sending email: ', error);
      return false;
  }
}



