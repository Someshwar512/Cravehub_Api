import { Request, Response } from 'express';
import { Favourite } from '../../database/entities/favourite';
import { AppDataSource } from '../../database/data-source';
import { ResponseUtil } from '../../utils/Response';
import { error } from 'console';

const favouriteRepositroy = AppDataSource.getRepository(Favourite);
export class FavouriteManagenemtController {
    // add favouirte api
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
}