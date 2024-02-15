import { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/Response';
import { UserDashboardController } from './userdashboard';
export class GuestUserController {
  private userDashboardController: UserDashboardController;

  constructor() {
    this.userDashboardController = new UserDashboardController();
  }

  async getDashboardByZipcode(req: Request, res: Response) {
    try {
      const { zipcode } = req.params;

      // Forward the request to the existing UserDashboardController to fetch dashboard data
      const dashboardData = await this.userDashboardController.getDashboard(req, res);

      // Filter the dashboard data based on the provided ZIP code
      const filteredData = this.filterDashboardByZipcode(dashboardData, zipcode);

      return ResponseUtil.sendResponse(res, 'Dashboard data for guest user', filteredData);
    } catch (error) {
      return ResponseUtil.sendErrror(res, 'Internal server error', 500,'');
    }
  }

  // Helper method to filter dashboard data by ZIP code
  private filterDashboardByZipcode(data: any, zipcode: string): any {
    const filteredData = { ...data }; 
  
    // Filter dishList based on the provided ZIP code
    if (filteredData.dishList) {
      filteredData.dishList = data.dishList.filter((dish: any) => {
        return dish.dates_available.some((date: any) => {
          return date.zipcode === zipcode;
        });
      });
    }
  
    // Filter popularDishes based on the provided ZIP code
    if (filteredData.popularDishes) {
      filteredData.popularDishes = data.popularDishes.filter((dish: any) => {
        return dish.dates_available.some((date: any) => {
          return date.zipcode === zipcode;
        });
      });
    }
  
    // Filter popularChefs based on the provided ZIP code
    if (filteredData.popularChefs) {
      filteredData.popularChefs = data.popularChefs.filter((chef: any) => {
        return chef.delivery_window.zipcode === zipcode;
      });
    }
  
    return filteredData;
  }
  
}
