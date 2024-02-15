import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/Response";
import { AppDataSource } from "../../database/data-source";
import { DatabaseTables, Roles,Deleted_Status ,OrderStatus, Status} from '../../constant';
import { Paginator, PaginationInfo} from '../../database/Paginator';
import { ILike } from 'typeorm';

import { Order } from "../../database/entities/order_table";

const orderRepository = AppDataSource.getRepository(Order);
export class Ordermanagementcontroller {
  // get all order (with delivered and Cancelled as Parameters)
  async  getOrders(req: Request, res: Response) {
    const searchKeyword = req.query.searchKeyword || "";
    const orderStatus = req.query.orderStatus || "";
  
    try {
        let queryBuilder = orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.offerCode", "offer")
            .leftJoinAndSelect("order.user", "user")
            // .leftJoinAndSelect("order.orderItems", "orderItems")
            // .leftJoinAndSelect("orderItems.dish", "dish")
            // .leftJoinAndSelect("dish.chefMenus", "chefMenu")
            // .leftJoinAndSelect("chefMenu.user", "chefUser");
  
        if (orderStatus !== "") {
            queryBuilder = queryBuilder.andWhere("order.order_status = :orderStatus", { orderStatus });
        }
  
        const orders = await queryBuilder.getMany(); // Execute the query and fetch the results
  
        const orderData = orders.map((order) => ({
            id: order.id,
            total_cost: order.total_amount,
            offer_code: order.offerCode ? order.offerCode.code : null,
            order_placement_date: order.created_on,
            order_scheduled_date: order.order_scheduled_date,
            discount_amount: order.discount_amount,
            // user_name: order.user ? order.user.getFullName() : null,
            // status: order.order_status,
            // dish_names: order.orderItems.map((item) => item.dish.name),
            // chef_name: order.orderItems.length > 0 ? (order.orderItems[0].dish.chefMenus.length > 0 ? order.orderItems[0].dish.chefMenus[0].user.getFullName() : null) : null,
        }));
  
        console.log("Order Data:", orderData);
  
        return ResponseUtil.sendResponse(res, "Success", orderData);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        return ResponseUtil.sendErrror(res, "Internal server error", 500, error || 'Unknown error');
    }
}


  // Order Status
  async orderStatus(req: Request, res: Response) {
    try {
      // const orderId = parseInt(req.params.id, 10);
      const { status,orderId } = req.body;
      // Check if the provided status is valid
      const validStatuses = Object.values(OrderStatus);
      if (!validStatuses.includes(status)) {
        return ResponseUtil.sendErrror(
          res,
          "Invalid status provided",
          400,
          "Invalid status"
        );
      }

      const order = await orderRepository.findOne({ where: { id: orderId } });

      if (!order) {
        return ResponseUtil.sendErrror(
          res,
          "Order not found",
          404,
          "Order not found"
        );
      }

      // Set the user status from the request body
      order.order_status = status as OrderStatus;

      // Save the updated user status in the database table
      await orderRepository.save(order);

      return res.json({ message: `Order ${status} successfully` });
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

  // View Particular order
  async Vieworder(req: Request, res: Response) {
    try {
      const orderId = parseInt(req.params.id, 10);

      // ORDER DATA
      const order = await orderRepository
        .createQueryBuilder("order_table")
        .leftJoinAndSelect("order_table.offerCode", "offerCode")
        .leftJoinAndSelect("offerCode.offerType", "offerType")
        .leftJoinAndSelect("order_table.pickupWindow", "pickupWindow")
        .leftJoinAndSelect("order_table.user", "user") // Join user relationship
        .leftJoinAndSelect("order_table.chef", "chef") // Join chef relationship
        .where("order_table.id = :orderId", { orderId })
        .getOne();

      if (!order) {
        return ResponseUtil.sendErrror(
          res,
          "Order not found",
          404,
          "Order not found"
        );
      }

      const OrderData = {
        order_id: order.id,
        delivery_preference: order.delivery_preference || null,
        order_placement_date: order.created_on || null,
        order_scheduled_date: order.order_scheduled_date || null,
        subtotal: order.subtotal || null,
        tax: order.tax_amount || null,
        delivery_charges: order.delivery_fees || null,
        discount_amount: order.discount_amount || null,
        total_cost: order.total_amount || null,
        pickup_window: order.pickupWindow?.window || null,
        cancelled_by: order.cancelled_by || null,
        reason_of_cancellation: order.reason_of_cancellation || null,
        order_instruction: order.order_instruction || null,
      };

      // OFFER DATA
      const offer = order.offerCode;
      const OfferData = {
        offer_code: offer?.code || null,
        offer_name: offer?.name || null,
        discount_type: offer?.discount_type || null,
        discount: offer?.discount || null,
        offer_type: offer?.offerType?.name || null,
        offer_channel: offer?.offerChannel?.name || null,
      };

      // USER DATA
      const user = await orderRepository
        .createQueryBuilder("order_table")
        .leftJoinAndSelect("order_table.user", "user") // Join user relationship
        .leftJoinAndSelect("user.address", "address")
        .leftJoinAndSelect("address.zipcode", "zipcode")
        .leftJoinAndSelect("zipcode.city", "city")
        .leftJoinAndSelect("city.state", "state")
        .where("order_table.id = :orderId", { orderId })
        .getOne();

      const UserData = {
        first_name: user?.user?.firstName || null,
        last_name: user?.user?.lastName || null,
        phone: user?.user?.phone || null,
        email: user?.user?.email || null,
        user_id: user?.user?.id || null,
        address_1: user?.user?.address[0]?.address_line_1 || null,
        address_2: user?.user?.address[0]?.address_line_2 || null,
        city: user?.user?.address[0]?.zipcode?.city?.name || null,
        state: user?.user?.address[0]?.zipcode?.city?.state?.name || null,
        zipcode: user?.user?.address[0]?.zipcode?.zipcode || null,
      };

      // CHEF DATA
      const chef = await orderRepository
        .createQueryBuilder("order_table")
        .leftJoinAndSelect("order_table.chef", "chef") // Join chef relationship
        .leftJoinAndSelect("chef.address", "address")
        .leftJoinAndSelect("address.zipcode", "zipcode")
        .leftJoinAndSelect("zipcode.city", "city")
        .leftJoinAndSelect("city.state", "state")
        .where("order_table.id = :orderId", { orderId })
        .getOne();

      const ChefData = {
        first_name: chef?.chef?.firstName || null,
        last_name: chef?.chef?.lastName || null,
        phone: chef?.chef?.phone || null,
        email: chef?.chef?.email || null,
        chef_id: chef?.chef?.id || null,
        address_1: chef?.chef?.address[0]?.address_line_1 || null,
        address_2: chef?.chef?.address[0]?.address_line_2 || null,
        city: chef?.chef?.address[0]?.zipcode?.city?.name || null,
        state: chef?.chef?.address[0]?.zipcode?.city?.state?.name || null,
        zipcode: chef?.chef?.address[0]?.zipcode?.zipcode || null,
      };

      const responseData = {
        Order: OrderData,
        Offer: OfferData,
        User: UserData,
        Chef: ChefData,
      };

      return ResponseUtil.sendResponse(
        res,
        "Order Details Retrieved Successfully",
        responseData
      );
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, "Internal server error", 500, error);
    }
  }

  // Order Status
  // async orderStatus(req: Request, res: Response) {
  //   try {
  //     // const orderId = parseInt(req.params.id, 10);
  //     const { status, record_id, table_name, column_name } = req.body;
  //     const testRepository = AppDataSource.getRepository(table_name);

  //     const order = await testRepository.findOne({ where: { id: record_id } });

  //     if (!order) {
  //       return ResponseUtil.sendErrror(
  //         res,
  //         "${table_name} not found",
  //         404,
  //         "${table_name} not found"
  //       );
  //     }
  //     // Set the status in the specified column_name
  //     order[column_name] = status;

  //     // Save the updated user status in the database table
  //     await testRepository.save(order);

  //     return res.json({ message: `Order ${status} successfully` });
  //   } catch (error) {
  //     console.error(error);
  //     return ResponseUtil.sendErrror(
  //       res,
  //       "Failed to update ordertest status",
  //       500,
  //       "Internal server error"
  //     );
  //   }
  // }


  async orderStatustest(req: Request, res: Response) {
    try {
      const { status, record_id, table_name, column_name } = req.body;
      const testRepository = AppDataSource.getRepository(table_name);
  
      const order = await testRepository.findOne({ where: { id: record_id } });
  
      if (!order) {
        return ResponseUtil.sendErrror(
          res,
          `${table_name} not found`,
          404,
          `${table_name} not found`
        );
      }
  
      // Set the status in the specified column_name
      order[column_name] = status;
  
      try {
        // Save the updated user status in the database table
        await testRepository.save(order);
        return res.json({ message: `Order ${status} successfully` });
      } catch (saveError) {
        console.error(saveError);
        return ResponseUtil.sendErrror(
          res,
          `Invalid Status for column ${column_name}`,
          500,
          "Internal server error"
        );
      }
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(
        res,
        "Failed to update status",
        500,
        "Internal server error"
      );
    }
  }
  
}