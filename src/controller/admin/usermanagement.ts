import { Request, Response } from 'express';
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
import { AuthClient } from '../../database/entities/auth_client';
import { AuthToken } from '../../database/entities/auth_token';
import { OTP_VERFIY } from '../../database/entities/opt_verfiy';
import { generateOTP } from '../../utils/functions';
// Add other imports and functions

import bcrypt from 'bcrypt';

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
const authClientRepository = AppDataSource.getRepository(AuthClient);
const deviceTokenRepository = AppDataSource.getRepository(AuthToken);
const otpTokenRepository = AppDataSource.getRepository(OTP_VERFIY);

export class AdminUserController {
  // adduser and addchef Api
  async adduser(req: Request, res: Response) {
    try {
      const {
        first_name,
        last_name,
        phone,
        email,
        address_line_1,
        address_line_2,
        zipcode_id,
        role,
        kitchen_name,
        chef_descriptions,
        food_pick_up_instructions,
      } = req.body;

      const user = new User();
      user.firstName = first_name;
      user.lastName = last_name;
      user.phone = phone;
      user.email = email;
      user.role = role;

      const userdata = await userRepository.save(user);
      const zipcode = await zipcodeRepository.findOne({
        where: { id: zipcode_id },
      });

      if (!zipcode) {
        return res.status(404).json({ message: "Zipcode not found" });
      }

      const userAddress = new UserAddress();
      userAddress.address_line_1 = address_line_1;
      userAddress.address_line_2 = address_line_2;
      userAddress.zipcode = zipcode_id;
      userAddress.user = user;

      await userAddressRepository.save(userAddress);

      if (role === Roles.CHEF) {
        user.role = Roles.CHEF;
        const kitchen = new Kitchen();
        kitchen.name = kitchen_name;
        kitchen.chef_descriptions = chef_descriptions;
        kitchen.food_pick_up_instructions = food_pick_up_instructions;
        kitchen.zipcode = zipcode;
        kitchen.chef = user;

        const savedKitchen = await kitchenRepository.save(kitchen);

        const kitchenPhoto = new KitchenPhotos();
        kitchenPhoto.kitchen = savedKitchen;

        await kitchenPhotosRepository.save(kitchenPhoto);

        // Array of cuisine IDs
        const cuisineIds = req.body.cusineid;
        const chefCuisineEntities = cuisineIds.map((cuisineId) => {
          const chefCuisine = new ChefCuisine();
          chefCuisine.cuisine_id = cuisineId;
          chefCuisine.chef_id = userdata.id;
          return chefCuisine;
        });
        // Save the chef_cuisine table
        await chefcuisineRepositroy.save(chefCuisineEntities);

        // chef_tags Array of tagids
        const tagIds = req.body.tagid;
        const chefTags = tagIds.map((tagId) => {
          const chefTag = new ChefTag();
          chefTag.tag_id = tagId;
          chefTag.chef_id = userdata.id;
          return chefTag;
        });

        // Save the chef
        await cheftagRepositroy.save(chefTags);
      }
      return ResponseUtil.sendResponse(
        res,
        `${role} created successfully`,
        user
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "internal server error", 500, error);
    }
  }

  // getuserbyId api
  // TODO add total offered and total delivered dishes
  async getUserDetails(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
  
      const user = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.address", "address")
        .leftJoinAndSelect("address.zipcode", "zipcode")
        .leftJoinAndSelect("zipcode.city", "city")
        .leftJoinAndSelect("city.state", "state")
        .leftJoinAndSelect("user.kitchens", "kitchens")
        .leftJoinAndSelect("user.chefCuisines", "chefCuisines")
        .leftJoinAndSelect("chefCuisines.cuisine", "cuisine")
        .leftJoinAndSelect("user.chefTags", "chefTags")
        .leftJoinAndSelect("chefTags.tag", "tag")
        .where("user.id = :userId", { userId })
        .getOne();
  
      if (!user) {
        return ResponseUtil.sendErrror(
          res,
          "User not found",
          404,
          "User not found"
        );
      }
  
      const responseData = {
        // Common properties for both users and chefs
        email: user.email,
        phone: user.phone,
        address_line_1: user.address[0]?.address_line_1,
        address_line_2: user.address[0]?.address_line_2,
        zipcode: user.address[0]?.zipcode
        ? [
            {
                zipcode_id: user.address[0].zipcode.id,
                zipcode: user.address[0].zipcode.zipcode,
            }
          ]
        : [],
      //   zipcode: [
      //     zipcode_id: user.address[0]?.zipcode.id,
      //     value: user.address[0]?.zipcode.zipcode,
      // ],
        city: user.address[0]?.zipcode.city.name,
        state: user.address[0]?.zipcode.city.state.name,
        firstName: user.firstName,
        lastName: user.lastName,
  
        ...(user.role === Roles.USER
          ? {
              user_id: user.id,
            }
          : {
              chef_id: user.id,
              chef_name: `${user.firstName || ""} ${user.lastName || ""}`,
              total_offered_dishes: 1, // TODO: Replace with actual logic
              total_delivered_orders: 0, // TODO: Replace with actual logic
              kitchen_name: user.kitchens?.[0]?.name,
              status: user.status,
              chefdescription: user.kitchens?.[0]?.chef_descriptions,
              pick_up_instructions: user.kitchens?.[0]?.food_pick_up_instructions,
              cuisines: user.chefCuisines?.map((c) => ({
                cuisine_id: c.cuisine.id,
                cuisine_name: c.cuisine.name,
              })),
              chef_tags: user.chefTags?.map((c) => ({
                tag_id: c.tag.id,
                tag_name: c.tag.tag_type,
              })),
            }),
      };
  
      return ResponseUtil.sendResponse(
        res,
        `${user.role} Details Retrieved Successfully`,
        responseData
      );
    } 
    catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
  
  
  // DeleteByUserId ApI
  async deleteUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return ResponseUtil.sendErrror(
          res,
          "User not found",
          404,
          "User not found"
        );
      }

      user.is_deleted = Deleted_Status.DELETED;

      await userRepository.save(user);

      return ResponseUtil.sendResponse(res, "User deleted successfully", user);
    } catch (error) {
      return ResponseUtil.sendErrror(
        res,
        "Failed to delete user",
        500,
        "Internal server error"
      );
    }
  }

  // UpdateUserById API
  async updateUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: [
        "address",
        "address.zipcode",
        "address.zipcode.city",
        "address.zipcode.city.state",
      ],
    });

    if (!user) {
      return ResponseUtil.sendErrror(
        res,
        "User not found",
        404,
        "User not found"
      );
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      address_line_1,
      address_line_2,
      zipcode_id,
    } = req.body;

    // Update user properties with new data
    user.firstName = first_name;
    user.lastName = last_name;
    user.email = email;
    user.phone = phone;

    // Update address details
    user.address.forEach((address) => {
      address.address_line_1 = address_line_1;
      address.address_line_2 = address_line_2;
      address.zipcode = zipcode_id;
    });

    // Save the updated user and address in the database
    await userRepository.save(user);
    await userAddressRepository.save(user.address); // Save the updated addresses

    // Prepare the response object
    const userData = {
      user_id: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: user.phone,
      address_line_1: user.address[0].address_line_1,
      address_line_2: user.address[0].address_line_2,
      zipcode: user.address[0].zipcode,
    };

    return ResponseUtil.sendResponse(
      res,
      "User updated successfully",
      userData
    );
  }

  //getAllUser
  async getAllUser(req: Request, res: Response) {
    // console.log("User id "+global.USER_ID)
    try {
      let users;
      const role = req.query.role;
      const searchKeyword = req.query.searchKeyword || "";
      // Sorting logic
      let sortOrder: "DESC" | "ASC" = "DESC";
      const sortingDirection = Number(req.query.sortOrder);
      if (sortingDirection === -1) {
        sortOrder = "DESC";
      } else if (sortingDirection === 1) {
        sortOrder = "ASC";
      }
      if (role === Roles.USER || role === Roles.CHEF) {
        users = await AppDataSource.getRepository(User)
          .createQueryBuilder(DatabaseTables.USERS)
          .where("user.role = :role", { role })
          .andWhere("user.is_deleted = :isDeleted", {
            isDeleted: Deleted_Status.NOT_DELETED,
          })
          .andWhere("user.status = :status", { status: Status.ACTIVE })
          .andWhere(
            "(user.email LIKE :searchKeyword OR user.phone LIKE :searchKeyword OR user.status LIKE:searchKeyword OR user.created_on LIKE :searchKeyword)",
            { searchKeyword: `%${searchKeyword}%` }
          )
          .orderBy("user.id", sortOrder);

        // Paginate the results using Paginator class
        const {
          records,
          paginationInfo,
        }: { records: User[]; paginationInfo: PaginationInfo } =
          await Paginator.paginate(users, req);

        if (role === Roles.USER) {
          // User data Object
          const userData = records.map((user: User) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            image_url: user.imageUrl,
            creation_date: formatDate(user.created_on),
            updation_date: formatDate(user.updated_on),
            status: user.status,
          }));

          return ResponseUtil.sendResponse(
            res,
            "Users Fetched Successfully",
            userData,
            paginationInfo
          );
        } else if (role === Roles.CHEF) {
          // Chef data Object
          const chefData = records.map((user: User) => ({
            id: user.id,
            chef_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.email,
            image: user.imageUrl,
            // Additional chef-related data
            total_offered_dishes: 1,
            total_delivered_orders: 0,
            kitchen_name: "Mary’s kitchen",
            status: user.status,
          }));

          return ResponseUtil.sendResponse(
            res,
            "Chefs Fetched Successfully",
            chefData,
            paginationInfo
          );
        }
      } else {
        return ResponseUtil.sendErrror(
          res,
          "Invalid role specified",
          400,
          "invalid role"
        );
      }
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // Active and inactive status
  async userStatus(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const { status } = req.body;

      // Check if the provided status is valid
      const validStatuses = Object.values(Status);
      if (!validStatuses.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid status"
        );
      }

      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return ResponseUtil.sendErrror(
          res,
          "User not found",
          404,
          "User not found"
        );
      }

      // Set the user status from the request body
      user.status = status as Status;

      // Save the updated user status in the database table
      await userRepository.save(user);

      return res.json({ message: `User ${status} successfully` });
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(
        res,
        "Failed to update user status",
        500,
        "Internal server error"
      );
    }
  }

  // AllDeleteUser Api
  async getAllDeletedUsers(req: Request, res: Response) {
    try {
      const searchKeyword = req.query.searchKeyword || "";
      const userRepository = AppDataSource.getRepository(User);

      let sortOrder: "ASC" | "DESC" = "ASC"; // Default sorting order
      const sortingDirection = req.query.sortOrder as string;

      // Check if sort order is provided as -1 (DESC) or 1 (ASC)
      if (sortingDirection === "1") {
        sortOrder = "ASC";
      } else if (sortingDirection === "-1") {
        sortOrder = "DESC";
      }

      const { records: deletedUsers, paginationInfo } =
        await Paginator.paginate(
          userRepository
            .createQueryBuilder(DatabaseTables.USERS)
            .where({ is_deleted: Deleted_Status.DELETED, role: Roles.USER })
            .andWhere(
              "(user.email LIKE :searchKeyword OR user.phone LIKE :searchKeyword OR user.status LIKE:searchKeyword OR user.created_on LIKE :searchKeyword)",
              { searchKeyword: `%${searchKeyword}%` }
            )
            .orderBy("user.id", sortOrder),
          req
        );

      const userData = deletedUsers.map((user: User) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        deletion_date: formatDate(user.updated_on),
        status: user.status,
      }));

      // Send the response with the fetched user data
      return ResponseUtil.sendResponse(
        res,
        "Deleted_Status Users Fetched Successfully",
        userData,
        paginationInfo
      );
    } catch (error) {
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }
}

