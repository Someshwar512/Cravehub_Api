import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { AppDataSource } from '../../database/data-source';
import { ResponseUtil } from '../../utils/Response';
import { PaymentTransaction } from '../../database/entities/payment_transactions';
import { Order } from '../../database/entities/order_table';
import { PaymentStatus } from '../../constant';
import { ChefMenu } from '../../database/entities/chef_menu';
import { Dish } from '../../database/entities/Dish';
import { Cart } from '../../database/entities/cart';
import cards from 'razorpay/dist/types/cards';

const OrderRepository = AppDataSource.getRepository(Order);
const PaymentRepository = AppDataSource.getRepository(PaymentTransaction);
const ChefMenuRepository=AppDataSource.getRepository(ChefMenu);
const cartRepository=AppDataSource.getRepository(Cart);
// Initialize Razorpay instance with API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export class PaymentManagementController {
  
  // confirmPayment api
  async confirmPayment(req: Request, res: Response) {
    try {
      const { razorpay_payment_id, razorpay_order_id, order_id, status } = req.body;

      // Verify the payment with RazorpayApi
      const payment = await razorpay.payments.fetch(razorpay_payment_id, razorpay_order_id);

      // Update payment status in the Order table
      const order = await OrderRepository.findOne({where:{id:order_id}});
      if (!order) {
        return ResponseUtil.sendErrror(res, 'Order not found', 404,'');
      }
      
      // Update the payment status in the order
      order.payment_status =PaymentStatus.PAID
      await OrderRepository.save(order)
      
      // Create a new PaymentTransaction object
      const newPayment = new PaymentTransaction();
      newPayment.order = order
      newPayment.razor_pay_order_id = razorpay_order_id
      newPayment.razor_payment_id = razorpay_payment_id
      newPayment.status = payment.status;
      newPayment.user=global.USER_ID

      // Save payment information in the PaymentTransaction table
      const savedPayment = await PaymentRepository.save(newPayment);
      // Send success response back to the client with updated payment status and details

        // // Delete cart items associated with the order
        // const cartItems = await cartRepository.find({ where: { dish:dish_id } });
        // await cartRepository.remove(cartItems);
      return ResponseUtil.sendResponse(res, `Payment ${status}`, payment);
    } catch (error) {
      // Catch any errors and send an internal server error response
      return ResponseUtil.sendErrror(res, 'Internal server error', 500,'');
    }
  }



}
