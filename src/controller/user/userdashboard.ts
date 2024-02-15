
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
//  import { extractMinutesFromTime } from '../../utils/functions';
import { OrderItems } from '../../database/entities/order_items';
const userRepository = AppDataSource.getRepository(User);
const reviewRepository = AppDataSource.getRepository(Reviews);
const dishRepository = AppDataSource.getRepository(Dish);
const authClientRepository = AppDataSource.getRepository(AuthClient)
export class UserDashboardController {

  async getDashboard(req: Request, res: Response) {
    // try {
    const {  date,zipcode } = req.query;

    // userData
    const user = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('address.zipcode', 'zipcode')
      .leftJoinAndSelect('zipcode.city', 'city')
      .leftJoinAndSelect('city.state', 'state')
      .where('user.id = :user_id', { user_id: global.USER_ID })
      .getOne();

    if (!user) {
      return ResponseUtil.sendErrror(res, 'User not found', 404, 'User not found');
    }

    // Parse the provided date
    const inputDate = date ? new Date(date.toString()) : new Date();
    //  date functions match date
    const formattedDate = format(inputDate, 'yyyy-MM-dd');

    const AvailableTodayDishes = await dishRepository
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
    .leftJoinAndSelect('user.address', 'address')
    .leftJoinAndSelect('user.kitchens', 'kitchens')
    .where('chefMenu.orderby_date = :orderDate', { orderDate: formattedDate })
    .andWhere('dishReviews.type = :reviewType', { reviewType: Reviews_Type.DISH })
     .andWhere('kitchens.zipcode = :zipcode', { zipcode:zipcode })
    .orderBy('chefMenu.orderby_date', 'ASC');
  

    // Map dishes
    const dishList = (await AvailableTodayDishes.getMany()).map(dish => {
      const ratings = dish.chefMenus[0]?.dish?.reviews.map(review => review.rating) || [];

      // Convert orderby_time to minutes
      const pickupTime = dish.chefMenus[0]?.orderby_time;
      const pickupTimeInMinutes = pickupTime ? convertTimeToMinutes(pickupTime) : null;

      return {
        // 
        dish_id: dish.id,
        dish_image: dish.image_url,
        dish_name: dish.name,
        dish_price: `$ ${dish.dish_price}`,
        chef_name: dish.chefMenus[0]?.user?.getFullName() || '',
        delivery_window: dish.chefMenus[0]?.pickupWindow.window || '',
        ratings: ratings,
        serving_available_count: dish.chefMenus[0]?.servings || 0,
        pickup_time: pickupTimeInMinutes != null ? `${pickupTimeInMinutes}mi` : null,
        dates_available: dish.chefMenus.map(menu => menu.orderby_date),
      };
    });


    // Fetch popular dishes
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
      .where('chefMenu.orderby_date = :orderDate', { orderDate: formattedDate })
      .andWhere('dishReviews.type = :reviewType', { reviewType: Reviews_Type.DISH })
      .orderBy('dishReviews.rating', 'DESC');

    const popularDishesList = (await popularDishes.getMany()).map(dish => {
      const ratings = dish.chefMenus[0]?.dish?.reviews.map(review => review.rating) || [];

      // Convert orderby_time to minutes
      const pickupTime = dish.chefMenus[0]?.orderby_time;
      const pickupTimeInMinutes = pickupTime ? convertTimeToMinutes(pickupTime) : null;

      return {
        dish_image: dish.image_url,
        dish_name: dish.name,
        dish_price: `$ ${dish.dish_price}`,
        chef_name: dish.chefMenus[0]?.user?.getFullName() || '',
        delivery_window: dish.chefMenus[0]?.pickupWindow.window || '',
        ratings: ratings,
        serving_available_count: dish.chefMenus[0]?.servings || 0,
        pickup_time: pickupTimeInMinutes != null ? `${pickupTimeInMinutes}mi` : null,
        order_by: dish.chefMenus[0]?.orderby_date,
        dates_available: dish.chefMenus.map(menu => menu.orderby_date),
      };
    });

    // Fetch popular chefs
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

    // Get today's date
    const todayDate = new Date();
    const todayDateString = todayDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD


    // Map popular chefs
    const popularChefsList = popularChefs.map(chef => {
      const isAvailableToday = chef.chefMenus.some(menu => menu.orderby_date === todayDateString);
      // If available today, get the pickup window time for today
      const todayMenu = chef.chefMenus.find(menu => menu.orderby_date === todayDateString);
      const pickupWindowTime = todayMenu?.pickupWindow.window || '';
      const ratings = chef.chefMenus[0]?.dish?.reviews.map(reviews => reviews.rating) || [];
      return {
        chef_id: chef.id,
        chef_image: chef.imageUrl,
        chef_name: chef.getFullName() || '',
        kitchen_name: chef.kitchens[0]?.name,
        country_of_origin: `${chef.address[0]?.zipcode.city.state.country.name}`,
        ratings: ratings,
        is_available_today: isAvailableToday ? 1 : 0,
        description: chef.kitchens[0]?.chef_descriptions,
        speciality: chef.tag?.map(tags => tags.tag_type) || [],
        delivery_window: isAvailableToday ? pickupWindowTime : null,
      };
    });

    // Use popularChefsList in your response

    // Prepare the response dashboard
    const responseData = {
      userData: {
        user_id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        email: user.email,
        address: `${user.address[0]?.zipcode.zipcode}, ${user.address[0]?.zipcode.city.name}, ${user.address[0]?.zipcode.city.state.name}`,
      },
      banners: [
        "https://img.freepik.com/free-vector/flat-style-food-sale-banner_23-2149076693.jpg?w=1060&t=st=1702026077~exp=1702026677~hmac=7c3c87119ae82c774e0efd648763dd107b5d1af2759f4baae46f6b0a59b6fe2e",
        "https://img.freepik.com/free-psd/grunge-burger-banner-template_23-2148719227.jpg?w=1060&t=st=1702026059~exp=1702026659~hmac=8e3f27de7df9fd547dd4af2a9263df8729a8602f689b5391cae474e3a7a02ea8",
        "https://img.freepik.com/free-psd/thanksgiving-concept-banner-template_23-2148704044.jpg?w=1060&t=st=1702035779~exp=1702036379~hmac=6e5c61630b20e1f4c9d3155eb0697d58e64eb1da5baa60dc58c35c2a1b4eca43"


      ], //hard code add image link
      dishList: dishList,
      popularChefs: popularChefsList,
      popularDishes: popularDishesList,
    };

    return ResponseUtil.sendResponse(res, "Show Dashboard Data", responseData);
    // } catch (error) {

    //   return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    // }
  }

}







