
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
import { convertTimeToMinutes } from '../../utils/functions';
// import { extractMinutesFromTime } from '../../utils/functions';
import { OrderItems } from '../../database/entities/order_items';
const userRepository = AppDataSource.getRepository(User);
const reviewRepository = AppDataSource.getRepository(Reviews);
const dishRepository = AppDataSource.getRepository(Dish);
const authClientRepository = AppDataSource.getRepository(AuthClient)

export class DishManagementController {

  // viewAllPopular dish api
  async viewAllPopularDishes(req: Request, res: Response) {
    try {
      const popularDishes = await dishRepository
        .createQueryBuilder(DatabaseTables.DISH)
        .leftJoinAndSelect('dish.cuisine', 'cuisine')
        .leftJoinAndSelect('dish.foodtype', 'foodtype')
        .leftJoinAndSelect('dish.portion_size', 'portion_size')
        .leftJoinAndSelect('dish.ingredients', 'ingredients')
        .leftJoinAndSelect('dish.dietries', 'dietries')
        .leftJoinAndSelect('dish.chefMenus', 'chefMenu')
        .leftJoinAndSelect('chefMenu.user', 'user')
        .leftJoinAndSelect('chefMenu.pickupWindow', 'pickupWindow')
        .leftJoinAndSelect('chefMenu.dish', 'dishes')
        .leftJoinAndSelect('dishes.reviews', 'dishReviews')
        .andWhere('dishReviews.type = :reviewType', { reviewType: Reviews_Type.DISH })
        .orderBy('dishReviews.rating', 'DESC');

      const popularDishesList = (await popularDishes.getMany()).map(dish => {
        const ratings = dish.chefMenus[0]?.dish?.reviews.map(review => review.rating) || [];
        return {
          dish_image: dish.image_url,
          dish_name: dish.name,
          dish_price: `$ ${dish.dish_price}`,
          chef_name: dish.chefMenus[0]?.user?.getFullName() || '',
          delivery_window: dish.chefMenus[0]?.pickupWindow.window || '',
          ratings: ratings,
          serving_available_count: dish.chefMenus[0]?.servings || 0,
          pickup: dish.chefMenus[0]?.orderby_time || '',
          portion_size: dish.portion_size?.name,
          food_type: dish.foodtype?.name,
          ingredients: dish.ingredients?.map(ingredient => ingredient.name) || [],
          dietary_preference: dish.dietries?.map(dietry => dietry.type) || [],
          description: dish.dish_description,
          order_by: dish.chefMenus[0]?.orderby_date,
          dates_available: dish.chefMenus.map(menu => menu.orderby_date),
        };
      });

      return ResponseUtil.sendResponse(res, "Show Popular Dishes", popularDishesList);
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }


  // viewdishbyid api
  async getDishDetailsById(req: Request, res: Response) {
    try {
      const { dish_id } = req.query;

      // Fetch dish details by ID

      const dish = await dishRepository
        .createQueryBuilder(DatabaseTables.DISH)
        .leftJoinAndSelect('dish.cuisine', 'cuisine')
        .leftJoinAndSelect('dish.foodtype', 'foodtype')
        .leftJoinAndSelect('dish.portion_size', 'portion_size')
        .leftJoinAndSelect('dish.ingredients', 'ingredients')
        .leftJoinAndSelect('dish.dietries', 'dietries')
        .leftJoinAndSelect('dish.chefMenus', 'chefMenu')
        .leftJoinAndSelect('chefMenu.user', 'user')
        .leftJoinAndSelect('chefMenu.pickupWindow', 'pickupWindow')
        .leftJoinAndSelect('chefMenu.dish', 'dishes')
        .leftJoinAndSelect('dishes.reviews', 'dishReviews')
        .where('dish.id = :dish_id', { dish_id: dish_id })
        .andWhere('dishReviews.type = :reviewType', { reviewType: Reviews_Type.DISH })
        .getOne();

      if (!dish) {
        return ResponseUtil.sendErrror(res, 'Dish not found', 404, 'Dish not found');
      }

      // Map dish details with reviews
      const chefMenus = dish.chefMenus || [];
      const ratings = (chefMenus[0]?.dish?.reviews || []).map(review => review.rating);

      const dishDetails = {
        dish_image: dish.image_url,
        dish_name: dish.name,
        dish_price: `$ ${dish.dish_price}`,
        chef_name: dish.chefMenus[0]?.user?.getFullName() || '',
        food_type: dish.foodtype?.name,
        delivery_window: dish.chefMenus[0]?.pickupWindow.window || '',
        ratings: ratings,
        order_by: dish.chefMenus[0]?.orderby_date,
        portion_size: dish.portion_size?.name,
        ingredients: dish.ingredients?.map(ingredient => ingredient.name) || [],
        dietary_preference: dish.dietries?.map(dietry => dietry.type) || [],
        description: dish.dish_description,
      };

      // Send the response
      return ResponseUtil.sendResponse(res, 'Dish Details', dishDetails);

    } catch (error) {
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, error);
    }
  }



  async viewDishByDate(req: Request, res: Response) {
    try {
      const { date } = req.query;

      const inputDate = date ? new Date(date.toString()) : new Date();
      const formattedDate = format(inputDate, 'yyyy-MM-dd');

      let availableDishesList;
        const availableDishes = await dishRepository
          .createQueryBuilder(DatabaseTables.DISH)
          .leftJoinAndSelect('dish.cuisine', 'cuisine')
          .leftJoinAndSelect('dish.foodtype', 'foodtype')
          .leftJoinAndSelect('dish.portion_size', 'portion_size')
          .leftJoinAndSelect('dish.ingredients', 'ingredients')
          .leftJoinAndSelect('dish.dietries', 'dietries')
          .leftJoinAndSelect('dish.chefMenus', 'chefMenu')
          .leftJoinAndSelect('chefMenu.user', 'user')
          .leftJoinAndSelect('chefMenu.pickupWindow', 'pickupWindow')
          .leftJoinAndSelect('chefMenu.dish', 'dishes')
          .leftJoinAndSelect('dishes.reviews', 'dishReviews')
          .where('chefMenu.orderby_date = :orderDate', { orderDate: formattedDate })
          .andWhere('dishReviews.type = :reviewType', { reviewType: Reviews_Type.DISH })
          .orderBy('chefMenu.orderby_date', 'ASC');

        availableDishesList = (await availableDishes.getMany()).map(dish => {
          const ratings = dish.chefMenus[0]?.dish?.reviews.map(review => review.rating) || [];
          const pickupTime = dish.chefMenus[0]?.orderby_time;
          const pickupTimeInMinutes = pickupTime ? convertTimeToMinutes(pickupTime) : null;

          return {
            dish_id: dish.id,
            dish_image: dish.image_url,
            dish_name: dish.name,
            dish_price: `$ ${dish.dish_price}`,
            chef_name: dish.chefMenus[0]?.user?.getFullName() || '',
            delivery_window: dish.chefMenus[0]?.pickupWindow.window || '',
            ratings: ratings,
            serving_available_count: dish.chefMenus[0]?.servings || 0,
            portion_size: dish.portion_size?.name,
            food_type: dish.foodtype?.name,
            ingredients: dish.ingredients?.map(ingredient => ingredient.name) || [],
            dietary_preference: dish.dietries?.map(dietry => dietry.type) || [],
            description: dish.dish_description,
            pickup_time: pickupTimeInMinutes != null ? `${pickupTimeInMinutes}mi` : null,
            dates_available: dish.chefMenus.map(menu => menu.orderby_date),
          };
        });
      

      return ResponseUtil.sendResponse(res, "Show Available Today Dishes", availableDishesList);
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }

  }

}



