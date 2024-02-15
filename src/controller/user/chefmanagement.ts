
import { Request, Response } from 'express';
import { getRepository, MoreThan } from 'typeorm';
import { User } from '../../database/entities/User';
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { Reviews } from '../../database/entities/reviews';
import { Dish } from '../../database/entities/Dish';
import { DatabaseTables, Reviews_Type, Roles } from '../../constant';
import { AuthClient } from '../../database/entities/auth_client';
import { ChefMenu } from '../../database/entities/chef_menu';
import { format } from 'date-fns';
// import { extractMinutesFromTime } from '../../utils/functions';
import { OrderItems } from '../../database/entities/order_items';
const userRepository = AppDataSource.getRepository(User);
const reviewRepository = AppDataSource.getRepository(Reviews);
const dishRepository = AppDataSource.getRepository(Dish);
const authClientRepository = AppDataSource.getRepository(AuthClient)

export class ChefManagementController {

  // viewAllPopularchef api
  async viewAllPopularChefs(req: Request, res: Response) {
    try {

      const popularChefs = await userRepository
        .createQueryBuilder(DatabaseTables.USERS)
        .leftJoinAndSelect('user.kitchens', 'kitchens')
        .leftJoinAndSelect('user.address', 'address')
        .leftJoinAndSelect('address.zipcode', 'zipcode')
        .leftJoinAndSelect('zipcode.city', 'city')
        .leftJoinAndSelect('city.state', 'state')
        .leftJoinAndSelect('state.country', 'country')
        .leftJoinAndSelect('user.tag', 'tag')
        .leftJoinAndSelect('user.chefMenus', 'chefMenu')
        .leftJoinAndSelect('chefMenu.pickupWindow', 'pickupWindow')
        .leftJoinAndSelect('chefMenu.dish', 'dishes')
        .leftJoinAndSelect('dishes.reviews', 'chefReviews')
        .andWhere('chefReviews.type = :reviewType', { reviewType: Reviews_Type.CHEF })
        .orderBy('chefReviews.rating', 'DESC')
        .getMany();

      // Map popular chefs
      const popularChefsList = popularChefs.map(chef => {
        const ratings = chef.chefMenus[0]?.dish?.reviews.map(reviews => reviews.rating) || [];
        return {
          chef_image: chef.imageUrl,
          chef_name: chef.getFullName() || '',
          kitchen_name: chef.kitchens[0]?.name,
          country_of_origin: `${chef.address[0]?.zipcode.city.state.country.name}`,
          ratings: ratings,
          is_available_today: 1, // TODO: Implement actual logic for availability
          description: chef.kitchens[0]?.chef_descriptions,
          speciality: chef.tag?.map(tags => tags.tag_type) || [],
          delivery_window: chef.chefMenus[0]?.pickupWindow.window || '',
        };
      });

      return ResponseUtil.sendResponse(res, 'Popular Chefs List', popularChefsList);
    } catch (error) {
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
    }
  }

  // viewchefbyid api
  async viewChefDetailsById(req: Request, res: Response) {
    try {
      const { chef_id } = req.query;

      const chef = await userRepository
        .createQueryBuilder(DatabaseTables.USERS)
        .leftJoinAndSelect('user.kitchens', 'kitchens')
        .leftJoinAndSelect('user.address', 'address')
        .leftJoinAndSelect('address.zipcode', 'zipcode')
        .leftJoinAndSelect('zipcode.city', 'city')
        .leftJoinAndSelect('city.state', 'state')
        .leftJoinAndSelect('state.country', 'country')
        .leftJoinAndSelect('user.tag', 'tag')
        .leftJoinAndSelect('user.chefMenus', 'chefMenu')
        .leftJoinAndSelect('chefMenu.pickupWindow', 'pickupWindow')
        .leftJoinAndSelect('chefMenu.dish', 'dishes')
        .leftJoinAndSelect('dishes.reviews', 'chefReviews')
        .andWhere('user.id = :chef_id', { chef_id: chef_id })
        .andWhere('chefReviews.type = :reviewType', { reviewType: Reviews_Type.CHEF })

        .orderBy('chefReviews.rating', 'DESC')
        .getOne();

      if (!chef) {
        return ResponseUtil.sendErrror(res, 'Chef not found', 404, 'Chef not found');
      }

      // Map chef details
      const chefDetails = {
        chef_image: chef.imageUrl,
        chef_name: chef.getFullName() || '',
        kitchen_name: chef.kitchens[0]?.name || null,
        country_of_origin: `${chef.address[0]?.zipcode.city.state.country.name}`,
        ratings: chef.chefMenus[0]?.dish?.reviews.map(reviews => reviews.rating) || [],
        is_available_today: 1, // TODO: Implement actual logic for availability
        description: chef.kitchens[0]?.chef_descriptions,
        speciality: chef.tag?.map(tags => tags.tag_type) || [],
        delivery_window: chef.chefMenus[0]?.pickupWindow.window || '',
      };

      // Send the response with the chef details
      return ResponseUtil.sendResponse(res, 'Chef Details', chefDetails);
    } catch (error) {
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
    }
  }


}
