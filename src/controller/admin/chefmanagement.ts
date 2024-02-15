import { Request, Response } from 'express';
import { Dish } from '../../database/entities/Dish';
import { And, createQueryBuilder, getRepository } from 'typeorm';
import { User } from '../../database/entities/User';
import { City } from '../../database/entities/City';
import { UserAddress } from '../../database/entities/User_address';
import { ResponseUtil } from '../../utils/Response';
import { AppDataSource } from '../../database/data-source';
import { DatabaseTables, Roles } from '../../constant';
import { formatDate } from '../../utils/functions';
import { Zipcode } from '../../database/entities/Zipcode';
import { Deleted_Status } from '../../constant';
import { Status } from '../../constant';
import { Kitchen } from '../../database/entities/Kitchen';
import { KitchenPhotos } from '../../database/entities/Kitchen_Photos';
import { Cuisine } from '../../database/entities/Cuisine';
import { Tag } from '../../database/entities/Tags';
import { ChefTag } from '../../database/entities/Chef_Tags';
import { Paginator } from '../../database/Paginator';
import { PaginationInfo } from '../../database/Paginator';
import { ChefCuisine } from '../../database/entities/Chef_Cuisine';
import { DishIngredients } from '../../database/entities/Dish_Ingredients';
import { DishDietary } from '../../database/entities/Dish_Dietary';


// declare global
const userRepository = AppDataSource.getRepository(User);
const userAddressRepository = AppDataSource.getRepository(UserAddress);
const kitchenRepository = AppDataSource.getRepository(Kitchen);
const kitchenPhotosRepository = AppDataSource.getRepository(KitchenPhotos);
const zipcodeRepository = AppDataSource.getRepository(Zipcode);
const cuisineRepository = AppDataSource.getRepository(Cuisine);
const tagReposityoy = AppDataSource.getRepository(Tag);
const cheftagRepositroy = AppDataSource.getRepository(ChefTag);
const chefcuisineRepositroy = AppDataSource.getRepository(ChefCuisine);
const dishchefRepositroy = AppDataSource.getRepository(Dish);
const dishIngredientsRepositroy = AppDataSource.getRepository(DishIngredients);
const dishDietaryRepositroy = AppDataSource.getRepository(DishDietary);
export class AdminChefController {
    // add dish api
    async addDish(req: Request, res: Response) {
        try {
            // Extract request body parameters
            const {
                chefId,
                dish_name,
                dish_price,
                dish_description,
                portion_size_id,
                preparation_time,
                cuisine_id,
                foodtype_id,
                ingredientsid,
                dietaryid,
            } = req.body;

            // Check if the chef exists
            const chef = await userRepository.findOne({ where: { id: chefId } });
            if (!chef) {
                return ResponseUtil.sendErrror(res, "Chef not found", 404, 'Chef not found');
            }

            // Create a new Dish entity
            const newDish = new Dish();
            newDish.name = dish_name;
            newDish.dish_price = dish_price;
            newDish.dish_description = dish_description;
            newDish.portion_size = portion_size_id;
            newDish.preparation_time = preparation_time;
            newDish.cuisine = cuisine_id;
            newDish.foodtype = foodtype_id;
            newDish.chef_id = chefId;

            // Save the dish table
            const savedDish = await dishchefRepositroy.save(newDish);

            // Save associations in ingredients_dish table
            const ingredientsIds = ingredientsid;
            const chefingredients = ingredientsIds.map((ingredientsId) => {
                const chefingredients = new DishIngredients();
                chefingredients.ingredients_id = ingredientsId;
                chefingredients.dish_id = savedDish.id;
                return chefingredients;
            });
            await dishIngredientsRepositroy.save(chefingredients);

            // Save associations in dish_dietary table
            const dietaryIds = dietaryid;
            const chefdietary = dietaryIds.map((dietaryId) => {
                const dishDietary = new DishDietary();
                dishDietary.dish_id = savedDish.id;
                dishDietary.dietary_id = dietaryId;
                return dishDietary;
            });
            await dishDietaryRepositroy.save(chefdietary);

            // Return success response
            return ResponseUtil.sendResponse(res, "Dish added successfully", savedDish);
        } catch (error) {
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }

    // view all dish list Api
    async viewAllDishes(req: Request, res: Response) {
        try {
            const chefId = parseInt(req.params.chefid, 10); // Extract chefId from request parameters
            
            const allDishesQuery = await dishchefRepositroy
                .createQueryBuilder(DatabaseTables.DISH)
                .leftJoinAndSelect('dish.cuisine', 'cuisine')
                .leftJoinAndSelect('dish.portion_size', 'portion_size')
                .where('dish.chef_id = :chefId', { chefId }) // Filter dishes by chefId
                .andWhere("dish.is_deleted = :isDeleted", {
                    isDeleted: Deleted_Status.NOT_DELETED,
                  })

            const { records, paginationInfo }: { records: Dish[], paginationInfo: PaginationInfo } = await Paginator.paginate(allDishesQuery, req);
    
            // Map dishes
            const dishList = records.map(dish => ({
                dish_image: dish.image_url,
                dish_name: dish.name,
                dish_id: dish.id,
                price: `$ ${dish.dish_price}`,
                portion_size: dish.portion_size?.name,
                preparation_time: dish.preparation_time,
            }));
    
            return ResponseUtil.sendResponse(res, "Dish list retrieved successfully", dishList, paginationInfo);
        } catch (error) {
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }
    


    // getdishbyid api
    async viewDish(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);

        const dish = await dishchefRepositroy
            .createQueryBuilder(DatabaseTables.DISH)
            .leftJoinAndSelect('dish.cuisine', 'cuisine')
            .leftJoinAndSelect('dish.foodtype', 'foodtype')
            .leftJoinAndSelect('dish.portion_size', 'portion_size')
              .leftJoinAndSelect('dish.ingredients', 'ingredients')
            .leftJoinAndSelect('dish.dietries', 'dietries')
            .where('dish.id = :id', { id })
            .getOne();

        if (!dish) {
            return ResponseUtil.sendErrror(res, "Dish not found", 404, 'Dish not found');
        }

        const dishDetails = {
            dish_image: dish.image_url,
            dish_name: dish.name,
            food_type: dish.foodtype?.name,
            cuisine_name: dish.cuisine?.name,
            price: dish.dish_price,
            description: dish.dish_description,
            preparation_time: dish.preparation_time,
            portion_size: dish.portion_size?.name,
            ingredients: dish.ingredients?.map(ingredient => ({
                id: ingredient.id,
                ingredients: ingredient.name,
              })) || [],
              
            dietary: dish.dietries?.map(dietry => ({
                id:dietry.id,
                dietary:dietry.type
            })) || [], 

        };

        // console.log(dishDetails);

        return ResponseUtil.sendResponse(res, "Dish details retrieved successfully", dishDetails);
    }

    // delete dish  api
    async deleteDishById(req: Request, res: Response) {
        try {
            const dishId = parseInt(req.params.id, 10);
            const dish = await dishchefRepositroy.findOne({ where: { id: dishId } });

            if (!dish) {
                return ResponseUtil.sendErrror(res, 'dish not found', 404, 'dish not found');
            }
            //   dish.is = Deleted_Status.DELETED;
            dish.is_deleted = Deleted_Status.DELETED;
            await dishchefRepositroy.save(dish);

            return ResponseUtil.sendResponse(res, 'dish deleted successfully', dish);
        } catch (error) {
            return ResponseUtil.sendErrror(res, 'Failed to delete user', 500, 'Internal server error');
        }
    }

    // update dish api
    async updateDish(req: Request, res: Response) {
        try {
            const dishId = parseInt(req.params.id, 10);

            // Extract request body parameters
            const {
                     dish_name, dish_price, dish_description, portion_size_id, preparation_time, cuisine_id, foodtype_id, ingredientsid, dietaryid,
                   } = req.body;

            // Check if the dish exists
            const existingDish = await dishchefRepositroy.findOne({ where: { id: dishId } });

            if (!existingDish) {
                return ResponseUtil.sendErrror(res, "Dish not found", 404, 'Dish not found');
            }

            // Update existing dish properties
            existingDish.name = dish_name;
            existingDish.dish_price = dish_price;
            existingDish.dish_description = dish_description;
            existingDish.portion_size = portion_size_id;
            existingDish.preparation_time = preparation_time;
            existingDish.cuisine = cuisine_id;
            existingDish.foodtype = foodtype_id;

            // Save the updated dish table
            const updatedDish = await dishchefRepositroy.save(existingDish);

            // Update associations in ingredients_dish table
            // First, remove existing associations in dishingredientds table
            await dishIngredientsRepositroy.delete({ dish_id: dishId });

            // Then, save the new associations
            const newIngredientsAssociations = ingredientsid.map((ingredientId) => {
                const association = new DishIngredients();
                association.ingredients_id = ingredientId;
                association.dish_id = dishId;
                return association;
            });
            await dishIngredientsRepositroy.save(newIngredientsAssociations);

          
            // First, remove existing associations
            await dishDietaryRepositroy.delete({ dish_id: dishId });

            // Then, save the new associations in dbtable
            const newDietaryAssociations = dietaryid.map((dietaryId) => {
                const association = new DishDietary();
                association.dish_id = dishId;
                association.dietary_id = dietaryId;
                return association;
            });
            
            // save in dishdietaryRepositroy database table
            await dishDietaryRepositroy.save(newDietaryAssociations);

         
            return ResponseUtil.sendResponse(res, "Dish updated successfully", updatedDish);
        } catch (error) {
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }

}