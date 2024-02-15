import express, { Request, Response } from 'express';
import { getManager, LessThan } from 'typeorm';
import { Offer } from '../../database/entities/Offer';
import { User } from '../../database/entities/User';
import { UserAddress } from '../../database/entities/User_address';
import { Zipcode } from '../../database/entities/Zipcode';
import { AppDataSource } from '../../database/data-source';
import { Deleted_Status, DiscountType, Status } from '../../constant';
import { ResponseUtil } from '../../utils/Response';

const offerRepository = AppDataSource.getRepository(Offer);
//TODO user ,zipcode specfic and offer use max 3 times
export class OfferManagementController {
    // apply coupon code 
    async applyCouponCode(req: Request, res: Response) {
        try {
            const { coupon_code, sub_total } = req.body;
    
            // Check if coupon code and sub_total are provided
            if (!coupon_code || !sub_total) {
                return ResponseUtil.sendErrror(res, 'Invalid request. Coupon code and sub_total are required', 422, '');
            }
    
            // Find offer by coupon code
            const offer = await offerRepository.findOne({ where: { code: coupon_code, status: Status.ACTIVE, is_deleted: Deleted_Status.NOT_DELETED } });
    
            // If offer not found or expired, return error
            if (!offer || new Date() < offer.start_date || new Date() > offer.end_date) {
                return ResponseUtil.sendErrror(res, 'Invalid or expired coupon code.', 422, '');
            }
    
            // Check if sub_total meets the minimum amount requirement
            if (offer.min_amount && sub_total < offer.min_amount) {
                return ResponseUtil.sendErrror(res, 'Subtotal does not meet the minimum amount requirement for this offer.', 422, '');
            }
    
            // Check if sub_total exceeds the maximum amount
            if (offer.max_amount && sub_total > offer.max_amount) {
                return ResponseUtil.sendErrror(res, 'Subtotal exceeds the maximum amount allowed for this offer.', 422, '');
            }
    
            // Calculate offer price based on offer type
            let offerPrice = 0;
            if (offer.discount_type === DiscountType.PERCENTAGE) {
                offerPrice = sub_total - (sub_total * (offer.discount / 100));
            } else if (offer.discount_type === DiscountType.FLAT_DISCOUNT) {
                offerPrice = sub_total - offer.discount;
            }
    
            // Ensure offer price is not negative
            if (offerPrice < 0) {
                offerPrice = 0;
            }
    
            return ResponseUtil.sendResponse(res, 'Coupon code applied successfully', { sub_total: offerPrice });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    
}
