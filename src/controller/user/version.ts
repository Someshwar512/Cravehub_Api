import { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/Response';
import { AuthClient } from '../../database/entities/auth_client';
import { AppVersions } from '../../database/entities/app_versions';
import { AppDataSource } from '../../database/data-source';
import { DatabaseTables } from '../../constant';

const authClientRepository=AppDataSource.getRepository(AuthClient);
const appVersionsRepository=AppDataSource.getRepository(AppVersions);
export class UserVersionController {

    // versions api implements
    async version(req: Request, res: Response) {
        try {
          const { app_id, app_secret, platform, version } = req.body;
      
          // Check if the auth client exists or not
          const authClient = await authClientRepository.findOne({ where: { app_id, app_secret } });
      
          if (!authClient) {
            return ResponseUtil.sendErrror(res, 'invalid auth client', 401, 'invalid auth client');
          }
      
          // Fetch the latest version for the provided platform
          const latestVersion = await appVersionsRepository
            .createQueryBuilder(DatabaseTables.APP_VERSIONS)
            .where('app_versions.platform = :platform', { platform })
            .orderBy('app_versions.created_on', 'DESC')
            .getOne();
      
          if (!latestVersion) {
            return ResponseUtil.sendErrror(res, 'No version found for the platform', 404, 'No version found for the platform');
          }
      
          // Compare user's version with the latest version
          if (latestVersion.version_number === version) 
          {  
            return ResponseUtil.sendResponse(res, 'Success', {  version: latestVersion.version_number, type: latestVersion.update_type,   });
          }
           else 
          {
             return ResponseUtil.sendResponse(res, 'Please update your version', { latest_version: latestVersion.version_number, update_type: latestVersion.update_type,});
          }
        } catch (error) {
          return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
        }
      }
      
}

















  