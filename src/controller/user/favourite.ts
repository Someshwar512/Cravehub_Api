import { Request, Response } from 'express';
import { Favourite } from '../../database/entities/favourite';
import { AppDataSource } from '../../database/data-source';
import { ResponseUtil } from '../../utils/Response';
import { error } from 'console';

const favouriteRepositroy = AppDataSource.getRepository(Favourite);
export class FavouriteManagenemtController {
    // add favouirte api implements
    async addFavourite(req: Request, res: Response) {

        try {
            const { dish_id, type } = req.body;

            const favouriteData = new Favourite();
            favouriteData.user = global.USER_ID;
            favouriteData.dish = dish_id;
            favouriteData.type = type;

            // save the db table
            const saveFavourite = await favouriteRepositroy.save(favouriteData);

            return ResponseUtil.sendResponse(res, `Add ${type}  IN FAVOURITES`, saveFavourite);

        }
        catch {
            return ResponseUtil.sendErrror(res, 'Internal Server errror', 500, error);
        }

    }

// TODO to only fetch Dish logic pendings
   // get all favourite dish API implementation
   async getAllFavouriteDish(req: Request, res: Response) {
    try {
        const userId = global.USER_ID; 
        const favoriteDishes = await favouriteRepositroy.find({ where: { user: userId }, relations: ['dish'] });

        return ResponseUtil.sendResponse(res, 'Favourite dishes fetched successfully', favoriteDishes);
    } catch (err) {
        return ResponseUtil.sendErrror(res, 'Internal Server Error', 500, "internal server error");
    }
}

 async  deleteFavouriteDish(req: Request, res: Response){
    try {
        const { Favourite_id } = req.body;
        const favoriteDish = await favouriteRepositroy.find({ where: { id: Favourite_id } });

        if (!favoriteDish) {
            return ResponseUtil.sendErrror(res,'Favorite dish not found',400,'')
        }

        // Assuming you have a method like delete() in your repository to delete the favorite dish
        await favouriteRepositroy.delete(favoriteDish[0].id);

        return ResponseUtil.sendResponse(res,"Favorite dish deleted successfully",favoriteDish);
    } catch (error) {
        console.error('Error deleting favorite dish:', error);
        return ResponseUtil.sendErrror(res,"Internal server error",500,error);
    }
}

// getallFavouriteChef
async getAllFavouriteChef(req: Request, res: Response) {
    try {
        const userId = global.USER_ID; 
        const favoriteDishes = await favouriteRepositroy.find({ where: { user: userId }, relations: ['dish'] });

        return ResponseUtil.sendResponse(res, 'Favourite dishes fetched successfully', favoriteDishes);
    } catch (err) {
        return ResponseUtil.sendErrror(res, 'Internal Server Error', 500, err);
    }
}
}