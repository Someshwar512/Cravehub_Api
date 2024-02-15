import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { Banner } from "../../database/entities/Banner";
import { AppDataSource } from "../../database/data-source";
import { DatabaseTables, Roles,Deleted_Status } from '../../constant';
import { Paginator, PaginationInfo} from '../../database/Paginator';
import { BannerType } from "../../constant";
import { ILike } from 'typeorm';
import { parseISO, isBefore } from 'date-fns';
import { Banner_Zipcode } from "../../database/entities/Banner_Zipcode";
import { ZipcodeOffers } from "../../database/entities/ZipcodeOffers";

const bannerRepository = AppDataSource.getRepository(Banner);
const bannerZipcodeRepository = AppDataSource.getRepository(Banner_Zipcode)
export class Bannermanagementcontroller {
    // get all banner
    async getBanner(req: Request, res: Response) {
        const searchKeyword = req.query.searchKeyword || '';
        try {
            
    
            // Using `createQueryBuilder` directly on the repository
            const queryBuilder = bannerRepository
            .createQueryBuilder('banner') 
            .leftJoinAndSelect('banner.offer','offer')
            .where([
            { name: ILike(`%${searchKeyword}%`) },
            { description: ILike(`%${searchKeyword}%`) },
            { start_date: ILike(`%${searchKeyword}%`) },
            { end_date: ILike(`%${searchKeyword}%`) },
    ]);
            const { records, paginationInfo }: { records: Banner[], paginationInfo: PaginationInfo } = await Paginator.paginate(queryBuilder, req);
    
            // Assuming you want to send an array of banners in the response
            const bannerData = records.map(banner => ({
                id:banner.id,
                banner_image: banner.image_url,
                banner_name: banner.name,
                start_date: banner.start_date,
                end_date: banner.end_date,
                type: banner.type,
                offer_id: banner.offer ? banner.offer.id : null,
                offer_code: banner.offer ? banner.offer.code : null,
            }));
    
            return ResponseUtil.sendResponse(res, 'Success:', bannerData, paginationInfo);
        } catch (error) {
            console.error('Error:', error);
            return ResponseUtil.sendResponse(res, 'Internal server error', 500, 'Internal server error');
        }
    }
    
    // Add banner
    async addBanner(req: Request, res: Response) {
        try {
            // Move the declaration of type before using it
            const {
                banner_name,
                banner_description,
                start_date,
                end_date,
                type,
                offer_id,
                zipcodes
            } = req.body;
    
            // Check if the type is MARKETING or OFFER
            const validTypes = Object.values(BannerType);
    
            if (!validTypes.includes(type)) {
                return ResponseUtil.sendErrror(res, 'Invalid type provided', 400, 'Invalid type');
            }
    
            // Convert date strings to Date objects
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
    
            // Check if start_date is less than end_date
            if (startDate < endDate) {
                const newBanner = new Banner();
                newBanner.name = banner_name;
                newBanner.description = banner_description;
                newBanner.start_date = startDate;
                newBanner.end_date = endDate;
                newBanner.type = type;
                newBanner.offer_id = offer_id;
    
                // Save the banner
                const savedBanner = await bannerRepository.save(newBanner);
    
                // Array of zipcodeIDs
                const zipcodeIds = zipcodes;
                const bannerZipcodeEntities = zipcodeIds.map((zipcodeId) => {
                    const bannerZipcode = new Banner_Zipcode(); 
                    bannerZipcode.banner_id = savedBanner.id;
                    bannerZipcode.zipcode_id = zipcodeId;
                    return bannerZipcode;
                }); 
    
                // Save the bannerZipcode entities in the join table
                await bannerZipcodeRepository.save(bannerZipcodeEntities);
    
                return ResponseUtil.sendResponse(res, 'Banner added successfully', savedBanner);
            } else {
                return ResponseUtil.sendErrror(res, 'Invalid date range', 400, 'Start date must be less than end date');
            }
        } catch (error) {
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }
    

    // view banner
    async Viewbanner(req: Request, res: Response) {
        try {
            const bannerId = parseInt(req.params.id, 10);
            const banner = await bannerRepository
                .createQueryBuilder('banner')
                .leftJoinAndSelect('banner.offer', 'offer')
                .leftJoinAndSelect('banner.zipcodes', 'zipcode')
                .where('banner.id = :bannerId', { bannerId })
                .getOne();
    
            if (!banner) {
                return ResponseUtil.sendErrror(res, "Banner not found", 404, 'Banner not found');
            }
    
            const bannerData = {
                banner_id: banner.id,
                banner_name: banner.name,
                start_date: banner.start_date,
                end_date: banner.end_date,
                description: banner.description,
                type: banner.type,
                offer_code: banner.offer ? banner.offer.code : null, 
                offer_id:banner.offer ? banner.offer.id : null,
                offer_name:banner.offer.name,
                banner_description:banner.description,
                zipcodes: banner.zipcodes.map(zipcode => 
                    ({ zipcode: zipcode.zipcode,
                        zipcode_id :zipcode.id
                 })), // Map zipcodes to an array
            };
    
            return ResponseUtil.sendResponse(res, "Banner Details Retrieved Successfully", bannerData);
    
        } catch (error) {
            console.error(error);
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }   

    // delete banner
    async deleteBannerById(req: Request, res: Response) {

        try {
          const bannerID = parseInt(req.params.id, 10);
          const banner = await bannerRepository.findOne({ where: { id: bannerID } });
    
          if (!banner) {
            return ResponseUtil.sendErrror(res, 'Banner not found', 404, 'Banner not found');
          }
    
          banner.is_deleted = Deleted_Status.DELETED;
          banner.updated_on = new Date(); // Set the updated_on date use for deleted user deleltions date and time
    
          await bannerRepository.save(banner);
    
          return ResponseUtil.sendResponse(res, 'Banner deleted successfully', banner);
        } catch (error) {
          return ResponseUtil.sendErrror(res, 'Failed to delete user', 500, 'Internal server error');
        }
      }

    // edit banner
    async updateBanner(req: Request, res: Response) {
        try {
            const bannerId = parseInt(req.params.id, 10);
    
            // Extract request body parameters
            const {
                banner_name,
                banner_description,
                start_date,
                end_date,
                type,
                offer_id,
            } = req.body;
    
            // Check if the banner exists
            const existingBanner = await bannerRepository.findOne({ where: { id: bannerId } });
    
            if (!existingBanner) {
                return ResponseUtil.sendErrror(res, "Banner not found", 404, 'Banner not found');
            }
    
            // Update existing banner properties
            existingBanner.name = banner_name;
            existingBanner.description = banner_description;
            existingBanner.start_date = new Date(start_date);
            existingBanner.end_date = new Date(end_date);
            existingBanner.type = type;
            existingBanner.offer_id = offer_id;
    
            // Save the updated banner
            const updatedBanner = await bannerRepository.save(existingBanner);
    
            return ResponseUtil.sendResponse(res, "Banner updated successfully", updatedBanner);
        } catch (error) {
            return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
        }
    }
    
    
    
    
}
