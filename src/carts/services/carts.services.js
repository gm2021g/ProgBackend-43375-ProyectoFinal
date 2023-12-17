import CustomError from "../../errors/customError.js";
import cartsModel from "../../models/carts.model.js";
import ticketModel from "../../models/ticket.model.js";
import userModel from "../../models/user.model.js";
import productsModel from "../../models/products.model.js";
import { ProductsServices } from "../../products/services/products.services.js";

class CartsService {
  createCart = async () => {
    try {
      const newCart = {
        cart: [],
      };
      const cart = await cartsModel.create(newCart);

      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  getAllCarts = async () => {
    try {
      const carts = await cartsModel.find();

      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (cid) => {
    try {
      const cart = await cartsModel
        .findById({ _id: cid })
        .populate("cart.product")
        .lean()
        .exec();

      if (!cart) throw new Error("Cart Not Found");

      return cart;
    } catch (error) {
      console.log(error);
    }
  };
  /*
  addProductToCart = async (cid, pid) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const findProduct = await cartsModel.findOne({ "carts.product": pid });

      if (findProduct) {
        const result = await cartsModel.updateOne(
          { "cart.product": pid },
          {
            $inc: {
              "cart.$.quantity": 1,
            },
          }
        );

        return result;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { cart: { product: pid } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };
*/

  addProductToCart = async (cid, pid, user) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const product = await productsModel.findById({ _id: pid }).lean().exec();

      if (!product) throw new Error("Product Not Found");

      // console.log(product.owner, " product.owner ****************** ");
      // console.log(user._id, " user._id ****************** ");
      // console.log(user.role, " user.role ****************** ");

      if (
        user.role === "PREMIUM" &&
        (product.owner !== user._id || !product.owner)
      ) {
        CustomError.createError({
          name: "Failed to add product to cart",
          message: "Cant add to cart a product that you don`t own",
        });
      }

      const findProduct = await cartsModel.findOne({ "cart.product": pid });

      if (findProduct) {
        const result = await cartsModel.updateOne(
          { "cart.product": pid },
          {
            $inc: {
              "cart.$.quantity": 1,
            },
          }
        );
        return result;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { cart: { product: pid } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  updateQuantity = async (cid, pid, quantity) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const product = await cartsModel.findOne({ "cart.product": pid });

      if (!product) throw new Error("Product Not Found In Cart");

      const result = await cartsModel.updateOne(
        { "cart.product": pid },
        {
          $inc: {
            "cart.$.quantity": quantity,
          },
        }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  addArrayOfProducts = async (cid, arrayOfProducts) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const mapProducts = arrayOfProducts.map((product) => {
        product: product._id;
      });

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { cart: { $each: mapProducts } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $pull: { cart: { product: pid } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteAllProducts = async (cid) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $set: { cart: [] } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  deleteCart = async (cid) => {
    try {
      let cart = await this.getCartById(cid);

      if (!cart) throw new Error("Cart Not Found");

      cart = await this.deleteAllProducts(cid);

      const result = await cartsModel.deleteOne({ _id: cid });

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  purchaseProducts = async (cid) => {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error("Cart Not Found");
      const products = Array.from(cart.cart);

      if (products.length == 0) return 0;

      const purchaser = await userModel.findOne({ cart: cid }).lean().exec();
      const total = await this.removeProductFromStock(cid, products);
      const reduceTotal = total.reduce((acc, curr) => acc + curr, 0);
      const ticket = await this.generateTicket(purchaser.email, reduceTotal);
      return ticket;
    } catch (error) {
      console.log(error);
    }
  };

  generateTicket = async (purchaser, total) => {
    try {
      const result = await ticketModel.create({
        amount: total,
        purchaser: purchaser,
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  removeProductFromStock = async (cid, products) => {
    try {
      const totalProducts = Promise.all(
        products.map(async (product) => {
          const productWithStock = await ProductsServices.updateStock(
            product.product._id,
            product.quantity
          );

          if (productWithStock) {
            await this.deleteProductFromCart(cid, product.product._id);

            return product.product.price * product.quantity;
          }

          return 0;
        })
      );

      return totalProducts;
    } catch (error) {
      console.log(error);
    }
  };
}

export const CartServices = new CartsService();
