import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Cart } from '../../database/entities/cart';
import { Dish } from '../../database/entities/Dish';
import { ResponseUtil } from '../../utils/Response';
import { DatabaseTables, DeleteCartAction } from '../../constant';
const dishRepository = AppDataSource.getRepository(Dish);
const cartRepository = AppDataSource.getRepository(Cart);

export class CartController {

  // addtocart api 
  async addToCart(req: Request, res: Response) {
    try {
      const { dish_id, total_quantity, delivery_date } = req.body;
      let newCart: any


      // Check if the dish exists
      const dish = await dishRepository.findOne({ where: { id: dish_id } });


      if (!dish) {
        return ResponseUtil.sendErrror(res, 'Dish not found .', 404, '');
      }

      let cartDetails = await cartRepository
        .createQueryBuilder(DatabaseTables.CART)
        .where({ user: global.USER_ID })
        .leftJoinAndSelect('cart.dish', 'dish')
        .getOne();


      if (cartDetails != null) {
        if (cartDetails?.dish.chef_id !== dish.chef_id) {
          const error = {
            name: 'Unprocessable Entity',
            code: 422
        };
        return ResponseUtil.sendErrror(res,'You cannot add dishes from different chefs.',422,error)
        }

        newCart = await cartRepository
          .createQueryBuilder(DatabaseTables.CART)
          .where({ user: global.USER_ID }).andWhere({ dish: dish_id })
          .andWhere("delivery_date = :delivery_date", { delivery_date: delivery_date })
          .leftJoinAndSelect('cart.dish', 'dish')
          .getOne();

        // If there is an existing cart item
        if (newCart != null) {

          newCart.total_quantity += total_quantity;
          newCart.total_price = dish.dish_price * newCart.total_quantity;
        } else {
          // If there is no existing cart item, create a new cart item

          newCart = new Cart();
          newCart.user = global.USER_ID;
          newCart.dish = dish;
          newCart.total_quantity = total_quantity;
          newCart.total_price = dish.dish_price * total_quantity;
          newCart.delivery_date = delivery_date;
        }

      }

      else {
        newCart = new Cart();
        newCart.user = global.USER_ID;
        newCart.dish = dish;
        newCart.total_quantity = total_quantity;
        newCart.total_price = dish.dish_price * total_quantity;
        newCart.delivery_date = delivery_date;
      }

      // Save the cart item
      await cartRepository.save(newCart);

      return ResponseUtil.sendResponse(res, 'Dish added to cart successfully', '');
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, '');
    }
  }
  
 
  // getCartDetails api
async getCartDetails(req: Request, res: Response) {
  try {
    // join multiple
    const cartItems = await cartRepository
      .createQueryBuilder(DatabaseTables.CART)
      .leftJoin('cart.user', 'user')
      .leftJoinAndSelect('cart.dish', 'dish')
      .leftJoinAndSelect('dish.chefMenus', 'chefMenus')
      .leftJoinAndSelect('chefMenus.pickupWindow', 'pickupWindow')
      .leftJoinAndSelect('dish.chef', 'chef')
      .leftJoinAndSelect('chef.kitchens', 'kitchen')
      .leftJoinAndSelect('cart.order', 'order')
      .getMany();

     
    // Check if cartItems array is empty
    if (!cartItems.length) {
      return ResponseUtil.sendResponse(res, 'Cart is empty', []);
    }

    // Extract chef_name and kitchen_name (assuming they are the same for all items in the cart)
    const chef_name = cartItems[0].dish.chef.getFullName();
    const kitchen_name = cartItems[0].dish.chef.kitchens[0]?.name || null;

      // Initialize total subtotal
      let sub_total: number = 0;

    // Organize cart items by delivery date
    const cartByDate: Record<string, any> = {};

    for (const cartItem of cartItems) {
      const deliveryDate = cartItem.delivery_date.toDateString();
      if (!cartByDate[deliveryDate]) {
        cartByDate[deliveryDate] = {
          dishes: [],
          dish_total: 0,
        };
      }

      // Access chefMenus safely
      const servings = cartItem.dish.chefMenus[0]?.servings;
      const pickupWindow = cartItem.dish.chefMenus[0]?.pickupWindow.window;

      /// Calculate the sub_total for each dish
      const dish_sub_total: number = cartItem.dish.dish_price * (cartItem.total_quantity || 1);
      sub_total += dish_sub_total; 

      cartByDate[deliveryDate].dish_total += dish_sub_total;
      cartByDate[deliveryDate].dishes.push({
        dish_id:cartItem.dish.id,
        dish_name: cartItem.dish.name,
        dish_price: cartItem.dish.dish_price,
        dish_image: cartItem.dish.image_url,
        servings_left: servings,
        delivery_preference: cartItem.order?.delivery_preference,
        delivery_window: pickupWindow,
        total_quantity:cartItem.total_quantity,
      });
    }

    // Construct the final response object
    const CartData = Object.entries(cartByDate).map(([date, details]) => ({
      date,
      ...details,
    }));

    // Send the response
    return ResponseUtil.sendResponse(res, 'Cart details retrieved successfully', { chef_name, kitchen_name, CartData,sub_total });
  } catch (error) {
    console.error(error);
    return ResponseUtil.sendErrror(res, 'Internal server error', 500, '');
  }
}

  //  delete cart item API
  async deleteCartItem(req: Request, res: Response) {

    try {
      const { dish_id, action, date } = req.body;

      // Find the cart item
      const cartItem = await cartRepository
        .createQueryBuilder(DatabaseTables.CART)
        .leftJoinAndSelect('cart.dish', 'dish')
        .where({ dish: dish_id })
        .andWhere('cart.delivery_date = :date', { date })

        .getOne();
      // Check if the cart item exists
      if (!cartItem) {
        return ResponseUtil.sendErrror(res, 'Cart item not found.', 404, '');
      }

      // Perform action based on input
      if (action === DeleteCartAction.SINGLE) {
        // Decrease the quantity
        if (cartItem.total_quantity > 1) {
          cartItem.total_quantity -= 1;
          cartItem.total_price = cartItem.dish.dish_price * cartItem.total_quantity;
        } else {
          // If quantity is o, delete the cart item
          await cartRepository.remove(cartItem);
          return ResponseUtil.sendResponse(res, 'Cart item deleted successfully', '');
        }
      } else if (action === DeleteCartAction.ALL) {
        // Delete cart item directly
        await cartRepository.remove(cartItem);
        return ResponseUtil.sendResponse(res, 'Cart item deleted successfully', '');
      } else {
        return ResponseUtil.sendErrror(res, 'Invalid action.', 400, '');
      }

      // Update the cart item
      await cartRepository.save(cartItem);

      return ResponseUtil.sendResponse(res, 'Cart item updated successfully', '');
    } catch (error) {
      console.error(error);
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, '');
    }
  }

  // checkout api checks dish sold out or not
  async checkout(req: Request, res: Response) {
    try {
      // Fetch cart items for the current user
      const cartItems = await cartRepository
      .createQueryBuilder(DatabaseTables.CART)
      .leftJoin('cart.user', 'user')
      .leftJoinAndSelect('cart.dish', 'dish')
      .leftJoinAndSelect('dish.chefMenus', 'chefMenus')
      .getMany();
    
      if (cartItems.length === 0) {
        return ResponseUtil.sendResponse(res, 'Cart is empty', []);
      }
  
      // Loop through cartItems to check servings availability
      for (const cartItem of cartItems) {
        const servingsAvailable = cartItem.dish.chefMenus?.[0]?.servings;
        // If servings are not available or not enough, remove the dish from the cart
        if (!servingsAvailable || servingsAvailable < cartItem.total_quantity) {
          return ResponseUtil.sendResponse(
            res,
            `Dish ${cartItem.dish.name} is sold out Removed from the cart.`,
            ''
          );
        }
      }
  
      // If all items are available, send success response
      return ResponseUtil.sendResponse(res, 'Checkout successful', []);
    } catch (error) {
      console.error('Error during checkout:', error);
      return ResponseUtil.sendErrror(res, 'Internal server error', 500, '');
    }
  }
  






  



}
