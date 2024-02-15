import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../database/entities/User'; 
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { DatabaseTables, Roles } from '../../constant';

export class AdminDashboardController {
  async getDashboardData(req: Request, res: Response) {
    try {
      const userRepository = AppDataSource.getRepository(User);
      
      const roleCounts = await userRepository.createQueryBuilder(DatabaseTables.USERS)
        .select("user.role AS role, COUNT(user.id) AS role_count")
        .groupBy("user.role")
        .getRawMany();
    
      const responseData = {};
    
      roleCounts.forEach((roleData) => {
        const role = roleData.role;
        const count = roleData.role_count;
        responseData[role] = count.toString();
      });
    
      const userCount = responseData[Roles.USER];
    
      return ResponseUtil.sendResponse(res, 'Success:', responseData);
    } catch (error) {
      console.error('Error:', error);
      return ResponseUtil.sendResponse(res, 'Internal server error', 500, 'Internal server error');
    }
  }
}
