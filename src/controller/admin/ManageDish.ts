import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { AppDataSource } from "../../database/data-source";
import { Paginator, PaginationInfo } from "../../database/Paginator";
import { FoodType } from "../../database/entities/Foodtype";
import { DatabaseTables, Roles } from "../../constant";
import { Ingredients } from "../../database/entities/Ingredients";
import { Cuisine } from "../../database/entities/Cuisine";
import { ILike } from "typeorm";
import { Dish } from "../../database/entities/Dish";
import { Tag } from "../../database/entities/Tags";
import { PortionSize } from "../../database/entities/Portion_Size";
import { Dietary } from "../../database/entities/Dietary";
import { Status } from "../../constant";
const dishRepositroy = AppDataSource.getRepository(Dish);
const foodtypeRepository = AppDataSource.getRepository(FoodType);
const ingredientsRepository = AppDataSource.getRepository(Ingredients);
const CuisineRepository = AppDataSource.getRepository(Cuisine);
const TagsRepository = AppDataSource.getRepository(Tag);
const PortionsizeRepository = AppDataSource.getRepository(PortionSize);
const DietaryRepository = AppDataSource.getRepository(Dietary);

export class Managedishcontroller {
  // get all dish data
  async viewAllDishes(req: Request, res: Response) {
    try {
      console.log("Entering viewAllDishes");

      const allDishesQuery = await dishRepositroy
        .createQueryBuilder(DatabaseTables.DISH)
        .leftJoinAndSelect("dish.cuisine", "cuisine")
        .leftJoinAndSelect("dish.foodtype", "foodtype")
        .leftJoinAndSelect("dish.ingredients", "ingredients");

      const {
        records,
        paginationInfo,
      }: { records: Dish[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(allDishesQuery, req);

      // Map dishes
      const dishList = records.map((dish) => ({
        dish_name: dish.name,
        cuisine: dish.cuisine?.name,
        ingredients: dish.ingredients
          ?.map((ingredient) => ingredient.name)
          .join(", "), // Adjust if ingredients is an array
        foodtype: dish.foodtype?.name,
        status: dish.status,
        dish_id:dish.id
      }));

      return ResponseUtil.sendResponse(
        res,
        "Dish list retrieved successfully",
        dishList,
        paginationInfo
      );
    } catch (error) {
      console.error("Error in viewAllDishes:", error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
  // get All food Type
  async getFoodType(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = foodtypeRepository
        .createQueryBuilder(DatabaseTables.FOODTYPE)
        .where([{ name: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: FoodType[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of banners in the response
      const foodtype_data = records.map((foodtype) => ({
        foodtype_id: foodtype.id,
        foodtype_name: foodtype.name,
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        foodtype_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendResponse(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }
  // add food type
  async addfoodtype(req: Request, res: Response) {
    try {
      // Move the declaration of type before using it
      const { foodtype_name } = req.body;

      const newfoodtype = new FoodType();
      newfoodtype.name = foodtype_name;

      const savedFoodtype = await foodtypeRepository.save(newfoodtype);

      return ResponseUtil.sendResponse(
        res,
        "food type added successfully",
        savedFoodtype
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
  // get all ingredients
  async getIngredients(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = ingredientsRepository
        .createQueryBuilder(DatabaseTables.INGREDIENTS)
        .where([{ name: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: Ingredients[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of banners in the response
      const ingredients_data = records.map((Ingredients) => ({
        ingredients_id: Ingredients.id,
        ingredients_name: Ingredients.name,
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        ingredients_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendErrror(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }
  // add ingredients
  async addingredients(req: Request, res: Response) {
    try {
      // Move the declaration of type before using it
      const { ingredients_name } = req.body;

      const newingredients = new Ingredients();
      newingredients.name = ingredients_name;

      const savedingredients = await ingredientsRepository.save(newingredients);

      return ResponseUtil.sendResponse(
        res,
        "ingredients added successfully",
        savedingredients
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
  // get all cuisine
  async getCuisine(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = CuisineRepository.createQueryBuilder(
        DatabaseTables.CUISINE
      ).where([{ name: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: Cuisine[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of cuisine in the response
      const cuisine_data = records.map((cuisine) => ({
        cuisine_id: cuisine.id,
        cuisine_name: cuisine.name, // Access the name property on each foodtype object
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        cuisine_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendErrror(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }
  // add cuisine
  async addcuisine(req: Request, res: Response) {
    try {
      // Move the declaration of type before using it
      const { cuisine_name } = req.body;

      const newcuisine = new Cuisine();
      newcuisine.name = cuisine_name;

      const savedcuisine = await CuisineRepository.save(newcuisine);

      return ResponseUtil.sendResponse(
        res,
        "cuisine added successfully",
        savedcuisine
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
  //  get all tags
  async getTags(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = TagsRepository.createQueryBuilder(
        DatabaseTables.TAGS
      ).where([{ tag_type: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: Tag[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of tags in the response
      const tag_data = records.map((tag) => ({
        tag_id: tag.id,
        name: tag.tag_type, // Access the tag_type property on each Tag object
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        tag_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendErrror(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }
  // /get all portion size
  async getPortionsize(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = PortionsizeRepository.createQueryBuilder(
        DatabaseTables.PORTION_SIZE
      ).where([{ name: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: PortionSize[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of tags in the response
      const portionsize_data = records.map((portionsize) => ({
        portionsize_id: portionsize.id,
        portionsize_name: portionsize.name, // Access the tag_type property on each Tag object
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        portionsize_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendErrror(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }
  // /get all Dietary
  async getDietary(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = DietaryRepository.createQueryBuilder(
        DatabaseTables.DIETARY
      ).where([{ type: ILike(`%${searchKeyword}%`) }]);

      const {
        records,
        paginationInfo,
      }: { records: Dietary[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of tags in the response
      const dietary_data = records.map((dietary) => ({
        dietary_id: dietary.id,
        dietary_type: dietary.type, // Access the tag_type property on each Tag object
      }));

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        dietary_data,
        paginationInfo
      );
    } catch (error) {
      console.error("Error:", error);
      return ResponseUtil.sendErrror(
        res,
        "Internal server error",
        500,
        "Internal server error"
      );
    }
  }

  // Dish Status
  async DishStatus(req: Request, res: Response) {
    try {
      const { status, dishId } = req.body;
      const validStatuses = Object.values(Status);

      if (!validStatuses.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid status"
        );
      }

      const dish = await dishRepositroy.findOne({
        where: { id: dishId },
      });

      if (!dish) {
        return ResponseUtil.sendErrror(
          res,
          "Dish not found",
          404,
          "Dish not found"
        );
      }

      dish.status = status as Status;
      await dishRepositroy.save(dish);

      return res.json({ message: `Dish ${status} successfully` });
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(
        res,
        "Failed to update dish status",
        500,
        "Internal server error"
      );
    }
  }
}
