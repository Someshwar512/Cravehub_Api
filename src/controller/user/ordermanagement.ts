import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { Order } from '../../database/entities/order_table';
import { AppDataSource } from '../../database/data-source';
import orders from 'razorpay/dist/types/orders';
import { ResponseUtil } from '../../utils/Response';

// Initialize Razorpay instance with API keys

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});


 const OrderRepository = AppDataSource.getRepository(Order);

export class OrderManagementController {

    // create order Razorpay
    async createOrder(req: Request, res: Response) {
        try {
            // Extract order details from the request body
            const {  total_amount,sub_total,discount_amount,tax_amount,delivery_fees,pickupwindow_id,offer_code_id} = req.body;

            const newOrder=new Order();
            newOrder.total_amount=total_amount
            newOrder.subtotal=sub_total
            newOrder.discount_amount=discount_amount
            newOrder.tax_amount=tax_amount
            newOrder.delivery_fees=delivery_fees
            newOrder.pickupWindow=pickupwindow_id
            newOrder.offerCode=offer_code_id
            newOrder.user=global.USER_ID


            // save in order table
            const savedOrder=await OrderRepository.save(newOrder);

            const razorpayOrder = await razorpay.orders.create({
                amount: total_amount * 100, 
                currency: 'INR',
                receipt: savedOrder.id.toString(),               
            });

            // Send the order ID and other necessary details to the client for payment processing
            res.status(200).json({
                success: true,
                razorpay_order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt,
                order_id:savedOrder.id,
               
            });

            // retrun ResponseUtil.sendErrror
        } catch (error) {
           
            return ResponseUtil.sendErrror(res,'Internal server error',500,'');
        }
    }

   
}
