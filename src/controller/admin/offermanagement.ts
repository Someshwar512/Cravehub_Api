import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { AppDataSource } from "../../database/data-source";
import { DatabaseTables, Roles,Deleted_Status } from '../../constant';
import { Paginator, PaginationInfo } from '../../database/Paginator';
import { BannerType } from "../../constant";
import { Offer } from "../../database/entities/Offer";
import { Zipcode } from "../../database/entities/Zipcode";
import { ZipcodeOffers } from "../../database/entities/ZipcodeOffers";
import { AutoApplied,DiscountType,Status } from "../../constant";
import { ILike } from 'typeorm';
import { Banner } from "../../database/entities/Banner";
import { OfferType } from "../../database/entities/OfferType";
import { OfferChannel } from "../../database/entities/OfferChannel";
import { OfferZipcodeTypes } from "../../database/entities/OfferZipcodeTypes";

const offerRepository = AppDataSource.getRepository(Offer);
const ZipcodeoffersRepository = AppDataSource.getRepository(ZipcodeOffers)
const bannerRepository = AppDataSource.getRepository(Banner)
const offerTypeRepository = AppDataSource.getRepository(OfferType)
const offerChannelRepository = AppDataSource.getRepository(OfferChannel)
const offerZipcodeTypesRepository = AppDataSource.getRepository(OfferZipcodeTypes)


export class OfferManagementController {
  // Add offer
  async addOffer(req: Request, res: Response) {
    try {
      const {
        offername,
        offercode,
        description,
        offer_type_id,
        offer_channel_id,
        startdate,
        enddate,
        discount_type,
        discount,
        discount_reason,
        max_amount,
        min_amount,
        offer_zipcode_types_id,
        offer_zipcodes_ids, // Array of zipcode IDs
        usage_limit,
        status,
        auto_applied,
      } = req.body;

      // Check if max_amount is greater than min_amount
      if (max_amount <= min_amount) {
        return ResponseUtil.sendErrror(
          res,
          "Max amount should be greater than min amount",
          400,
          "Validation Error"
        );
      }

      // Check for auto_applied
      const validauto_applied = Object.values(AutoApplied);

      if (!validauto_applied.includes(auto_applied)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid auto_applied provided",
          400,
          "Invalid type"
        );
      }

      // Check for discount_type
      const validdiscount_type = Object.values(DiscountType);

      if (!validdiscount_type.includes(discount_type)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid discount_type provided",
          400,
          "Invalid type"
        );
      }

      // Check for discount_type
      const validstatus = Object.values(Status);

      if (!validstatus.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid type"
        );
      }

      // Create the offer
      const newoffer = new Offer();
      newoffer.name = offername;
      newoffer.code = offercode;
      newoffer.description = description;
      newoffer.offerType = offer_type_id;
      newoffer.offerChannel = offer_channel_id;
      newoffer.start_date = startdate;
      newoffer.end_date = enddate;
      newoffer.discount_type = discount_type;
      newoffer.discount = discount;
      newoffer.discount_reason = discount_reason;
      newoffer.max_amount = max_amount;
      newoffer.min_amount = min_amount;
      newoffer.usage_limit = usage_limit;
      newoffer.status = status;
      newoffer.auto_applied = auto_applied;
      newoffer.offerZipcodeTypes = offer_zipcode_types_id;

      // Save the offer
      const savedOffer = await offerRepository.save(newoffer);

      // Save associations in ingredients_dish table
      const offer_zipcodes_Ids = offer_zipcodes_ids;

      const zipcodeoffers = offer_zipcodes_Ids.map((offer_zipcode_id) => {
        const zipcodeOffer = new ZipcodeOffers();
        zipcodeOffer.zipcode = offer_zipcode_id;
        zipcodeOffer.offer = savedOffer;
        return zipcodeOffer;
      });

      await ZipcodeoffersRepository.save(zipcodeoffers);

      return ResponseUtil.sendResponse(
        res,
        "Offer added successfully",
        savedOffer
      );
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // get all offers
  async getalloffer(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    try {
      // Using `createQueryBuilder` directly on the repository
      const queryBuilder = offerRepository
        .createQueryBuilder("offer")
        .leftJoinAndSelect("offer.offerZipcodeTypes", "offerZipcodeTypes")
        .leftJoinAndSelect("offer.zipcodes", "zipcode")
        .leftJoinAndSelect("offer.offerType","offerType")
        
        .where([
          { description: ILike(`%${searchKeyword}%`) },
          { start_date: ILike(`%${searchKeyword}%`) },
          { end_date: ILike(`%${searchKeyword}%`) },
        ]);

      const {
        records,
        paginationInfo,
      }: { records: Offer[]; paginationInfo: PaginationInfo } =
        await Paginator.paginate(queryBuilder, req);

      // Check if each Offer ID is present in the banner table
      const offerData = await Promise.all(
        records.map(async (offer) => {
          const bannerExists = await bannerRepository.findOne({
            where: { offer: { id: offer.id } },
          });
          return {
            offer_id: offer.id,
            offer_name: offer.name,
            start_date: offer.start_date,
            end_date: offer.end_date,
            Usage: offer.usage_limit,
            code: offer.code,
            offer_type: offer.offerType.name,
            status: offer.status,
            zipcodes_types: offer.offerZipcodeTypes.name,
            zipcodes: offer.zipcodes.map((zipcode) => zipcode.zipcode) || [],
            bannerPresent: !!bannerExists, // Check if Offer ID is present in banner table
          };
        })
      );

      return ResponseUtil.sendResponse(
        res,
        "Success:",
        offerData,
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

  // delete offer
  async deleteofferById(req: Request, res: Response) {
    try {
      const offerID = parseInt(req.params.id, 10);
      const offer = await offerRepository.findOne({ where: { id: offerID } });

      if (!offer) {
        return ResponseUtil.sendErrror(
          res,
          "Offer not found",
          404,
          "Offer not found"
        );
      }

      offer.is_deleted = Deleted_Status.DELETED;
      offer.updated_on = new Date(); // Set the updated_on date use for deleted user deleltions date and time

      await offerRepository.save(offer);

      return ResponseUtil.sendResponse(
        res,
        "Offer deleted successfully",
        offer
      );
    } catch (error) {
      return ResponseUtil.sendErrror(
        res,
        "Failed to delete user",
        500,
        "Internal server error"
      );
    }
  }

  // view offer
  async Viewoffer(req: Request, res: Response) {
    try {
      const offerId = parseInt(req.params.id, 10);
      const offer = await offerRepository
    .createQueryBuilder("offer")
    .leftJoinAndSelect("offer.offerType", "offerType")
    .leftJoinAndSelect("offer.offerChannel", "offerChannel")
    .leftJoinAndSelect("offer.offerZipcodeTypes", "offerZipcodeTypes")
    .leftJoinAndSelect("offer.zipcodes", "zipcodes")
    .where("offer.id = :offerId", { offerId })
    .getOne();

      if (!offer) {
        return ResponseUtil.sendErrror(
          res,
          "Offer not found",
          404,
          "Offer not found"
        );
      }

      const offerData = {
        offer_id: offer.id,
        Coupon_name: offer.name,
        coupon_description: offer.description,
        discount: offer.discount,
        discount_reason: offer.discount_reason,
        usage: offer.usage_limit,
        start_date: offer.start_date,
        end_date: offer.end_date,
        offer_type_id:offer.offerType.id,
        offer_type: offer.offerType.name,
        zipcode_type_id:offer.offerZipcodeTypes.id,
        zipcode_type: offer.offerZipcodeTypes.name,
        channel_id:offer.offerChannel.id,
        channel: offer.offerChannel.name,
        code: offer.code,
        discount_type: offer.discount_type,
        offer_name:offer.name,
        max_amount:offer.max_amount,
        min_amount:offer.min_amount,
        status:offer.status,
        auto_applied:offer.auto_applied,
        offer_zipcodes: offer.zipcodes.map(zipcodeOffer => 
          ({ 
            zipcode: zipcodeOffer.zipcode,
            zipcode_id: zipcodeOffer.id
          })),
      };

      return ResponseUtil.sendResponse(
        res,
        "Offer Details Retrieved Successfully",
        offerData
      );
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // Update offer
  async updateOffer(req: Request, res: Response) {
    try {
      const offerId = parseInt(req.params.id, 10);

      // Extract request body parameters
      const {
        offername,
        offercode,
        description,
        offer_type_id,
        offer_channel_id,
        startdate,
        enddate,
        discount_type,
        discount,
        discount_reason,
        max_amount,
        min_amount,
        offer_zipcode_types_id,
        offer_zipcodes_ids,
        usage_limit,
        status,
        auto_applied,
      } = req.body;

      // Check if max_amount is greater than min_amount
      if (max_amount <= min_amount) {
        return ResponseUtil.sendErrror(
          res,
          "Max amount should be greater than min amount",
          400,
          "Validation Error"
        );
      }

      // Check for auto_applied
      const validauto_applied = Object.values(AutoApplied);
      if (!validauto_applied.includes(auto_applied)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid auto_applied provided",
          400,
          "Invalid type"
        );
      }

      // Check for discount_type
      const validdiscount_type = Object.values(DiscountType);
      if (!validdiscount_type.includes(discount_type)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid discount_type provided",
          400,
          "Invalid type"
        );
      }

      // Check for status
      const validstatus = Object.values(Status);
      if (!validstatus.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid type"
        );
      }

      // Find the existing offer
      const existingOffer = await offerRepository.findOne({
        where: { id: offerId },
      });

      if (!existingOffer) {
        return ResponseUtil.sendErrror(
          res,
          "Offer not found",
          404,
          "Offer not found"
        );
      }

      // Update existing offer properties
      existingOffer.name = offername;
      existingOffer.code = offercode;
      existingOffer.description = description;
      existingOffer.offerType = offer_type_id;
      existingOffer.offerChannel = offer_channel_id;
      existingOffer.start_date = startdate;
      existingOffer.end_date = enddate;
      existingOffer.discount_type = discount_type;
      existingOffer.discount = discount;
      existingOffer.discount_reason = discount_reason;
      existingOffer.max_amount = max_amount;
      existingOffer.min_amount = min_amount;
      existingOffer.usage_limit = usage_limit;
      existingOffer.status = status;
      existingOffer.auto_applied = auto_applied;
      existingOffer.offerZipcodeTypes = offer_zipcode_types_id;

      // Save the updated offer
      const updatedOffer = await offerRepository.save(existingOffer);

      // Update associations in zipcode_offers table
      // First, remove existing associations
      await ZipcodeoffersRepository.delete({ offer: { id: offerId } });

      // Then, save the new associations
      const newZipcodeOffers = offer_zipcodes_ids.map((offer_zipcode_id) => {
        const zipcodeOffer = new ZipcodeOffers();
        zipcodeOffer.zipcode = offer_zipcode_id;
        zipcodeOffer.offer = updatedOffer;
        return zipcodeOffer;
      });

      await ZipcodeoffersRepository.save(newZipcodeOffers);

      return ResponseUtil.sendResponse(
        res,
        "Offer updated successfully",
        updatedOffer
      );
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }


  
  // get all offer types
  async getOfferType(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || '';
    try {
        
        const queryBuilder = offerTypeRepository
         .createQueryBuilder(DatabaseTables.OFFER_TYPE)
         .where([
            { name: ILike(`%${searchKeyword}%`) },
        ]);
            
        const { records, paginationInfo }: { records: OfferType[], paginationInfo: PaginationInfo } = await Paginator.paginate(queryBuilder, req);

        // Assuming you want to send an array of banners in the response
        const offertype_data = records.map(offertype => ({
            offertype_id :offertype.id,
            offertype_name: offertype.name, 
        }));
        

        return ResponseUtil.sendResponse(res, 'Success:', offertype_data, paginationInfo);
    } catch (error) {
        console.error('Error:', error);
        return ResponseUtil.sendResponse(res, 'Internal server error', 500, 'Internal server error');
    }
}

// get all offer Channel
async getOfferChannel(req: Request, res: Response) {
  const searchKeyword = req.query.searchKeyword || '';
  try {
      
      const queryBuilder = offerChannelRepository
       .createQueryBuilder(DatabaseTables.OFFER_CHANNEL)
       .where([
          { name: ILike(`%${searchKeyword}%`) },
      ]);
          
      const { records, paginationInfo }: { records: OfferChannel[], paginationInfo: PaginationInfo } = await Paginator.paginate(queryBuilder, req);

      // Assuming you want to send an array of banners in the response
      const offerchannel_data = records.map(offerchannel => ({
        offerchannel_id :offerchannel.id,
        offerchannel_name: offerchannel.name, 
      }));
      

      return ResponseUtil.sendResponse(res, 'Success:', offerchannel_data, paginationInfo);
  } catch (error) {
      console.error('Error:', error);
      return ResponseUtil.sendResponse(res, 'Internal server error', 500, 'Internal server error');
  }
}

  // get all offer Zipcode types
  async getOfferZipcodeType(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || '';
    try {
        
        const queryBuilder = offerZipcodeTypesRepository
         .createQueryBuilder(DatabaseTables.OFFER_ZIPCODE_TYPES)
         .where([
            { name: ILike(`%${searchKeyword}%`) },
        ]);
            
        const { records, paginationInfo }: { records: OfferType[], paginationInfo: PaginationInfo } = await Paginator.paginate(queryBuilder, req);

        // Assuming you want to send an array of banners in the response
        const offertype_data = records.map(offerzipcodetype => ({
          offerzipcodetype_id :offerzipcodetype.id,
          offerzipcodetype_name: offerzipcodetype.name, 
        }));
        

        return ResponseUtil.sendResponse(res, 'Success:', offertype_data, paginationInfo);
    } catch (error) {
        console.error('Error:', error);
        return ResponseUtil.sendResponse(res, 'Internal server error', 500, 'Internal server error');
    }
}


}
