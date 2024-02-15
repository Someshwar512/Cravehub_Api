import { Request, Response } from 'express';
import { User } from '../../src/database/entities/User';
import { AppDataSource } from '../database/data-source';
import { ResponseUtil } from '../../src/utils/Response';
import { UserVerfiy } from '../constant';
import { AuthToken } from '../database/entities/auth_token';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Roles } from '../constant';
import { formatDate } from '../../src/utils/functions';
import { AuthClient } from '../database/entities/auth_client';
import { generateJwtToken } from '../../src/utils/functions';
const authClientRepository = AppDataSource.getRepository(AuthClient);
const userRepository = AppDataSource.getRepository(User);
const deviceTokenRepository = AppDataSource.getRepository(AuthToken);
export class Login {

  // login Api Admin Chef and User
  async login(req: Request, res: Response) {
    try {
      const { app_id, app_secret, email, password, device_token, role, phone } =
        req.body;
      const data: any = {}; //object store data
      var user: any;

      // Check if the auth client exists or not
      const authClient = await authClientRepository.findOne({
        where: { app_id, app_secret },
      });

      // Check if the provided app_id and app_secret match only  user role
      if (
        role === Roles.USER &&
        app_id !== authClient?.app_id &&
        app_secret !== authClient?.app_secret
      ) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid app credentials for user role",
          401,
          "Invalid app credentials"
        );
      }

      if (!(role in Roles)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid role",
          400,
          "Invalid Role"
        );
      }

      if (role == Roles.USER) {
        if (email !== undefined) {
          user = await userRepository.findOne({ where: { email, role } });
        } else if (phone !== undefined) {
          user = await userRepository.findOne({ where: { phone, role } });
        }
      } else {
        user = await userRepository.findOne({ where: { email, role } });
      }
      if (role === Roles.USER) {
        const isVerified = user.is_verified === UserVerfiy.VERFIED;
      
        if (!isVerified) {
          return ResponseUtil.sendResponse(
            res,
            "Please verify your account",
            { is_verified: false ,user},
          );
        }
      }



      if (!user) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid email or password",
          403,
          "Usre not found"
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid password",
          403,
          "Invalid Password"
        );
      }

      // functions token genrate
      const token = generateJwtToken(user.id);

      const tokenExpirationInSeconds = jwt.decode(token).exp;
      const expiryDate = new Date(tokenExpirationInSeconds * 1000);

      const newDeviceToken = new AuthToken();
      newDeviceToken.access_token = token;
      newDeviceToken.user_id = user.id;
      newDeviceToken.device_token = device_token;

      const tokenData = await deviceTokenRepository.save(newDeviceToken);

      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
       
      };

      const tokenDataSubset = {
        token: tokenData.access_token,
        type: "Bearer",
        expiresIn: process.env.TOKEN_EXPIRATION_DAYS,
        expiryDate: formatDate(expiryDate),
      };

      data["access_token"] = tokenDataSubset;
      data["user"] = userData;

      return ResponseUtil.sendResponse(res, `${role} Login Success`,{ is_verified: true ,data});
    } catch (error) {

      return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
    }
  }
}
