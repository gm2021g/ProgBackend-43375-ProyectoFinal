import express from "express";
import { ProductsServices } from "../products/services/products.services.js";
import { CartServices } from "../carts/services/carts.services.js";
import { purchaseCart } from "../carts/controller/carts.controller.js";
import { emptyCart } from "../carts/controller/carts.controller.js";
import { authPolicies, authToken } from "../utils/jwt.js";

const Router = express.Router();

//Mostrar todos los productos
Router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const options = {
      limit: limit || 5,
      page: page || 1,
      sort: { price: sort } || { price: 1 },
      lean: true,
    };

    const result = await ProductsServices.getProducts(query, options);

    const user = req.user;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const user_cart = user.cart;

    const response = {
      status: "succes",
      payload: result.docs,
      user,
      first_name,
      last_name,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${result.limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${result.limit}`
        : null,
      user_cart,
    };

    const sort_val = options.sort;
    res.render("home", {
      style: "styles.css",
      response,
      sort_val,
    });
  } catch (error) {
    req.logger.error(error);
    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

// Muestra un producto detallado
Router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductsServices.getProductById(pid);
    const user = req.session.user;

    res.render("productDetail", {
      style: "styles.css",
      product,
      user,
    });
  } catch (error) {
    req.logger.error(error);
    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

// Muestra detalle de usuario para modificación 
Router.get("/users/modify/:uid", async (req, res) => {
  try {
    const { pid } = req.params;
    const user = await ProductsServices.getProductById(pid);
    const userCurrent = req.session.user;

    res.render("modifyUser", {
      style: "styles.css",
      user,
      userCurrent,
    });
  } catch (error) {
    req.logger.error(error);
    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

// Muestra un carrito
Router.get(
  "/carts/:cid",
  authToken,
  authPolicies("USER", "PREMIUM"),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const result = await CartServices.getCartById(cid);

      res.render("cart", {
        style: "styles.css",
        cart: result,
      });
    } catch (error) {
      req.logger.error(error);
      res.send({
        status: "error",
        error: error.message || "SOMETHING WENT WRONG",
      });
    }
  }
);

Router.post("/carts/:cid/purchase", purchaseCart);

Router.delete("/:cid", emptyCart);

// crear productos, llama al formulario
Router.get(
  "/create",
  authToken,
  authPolicies("ADMIN", "PREMIUM"),
  async (req, res) => {
    try {
      res.render("create", {
        style: "style.css",
      });
    } catch (error) {
      req.logger.error(error);
      res.send({
        succes: false,
        error,
      });
    }
  }
);

export default Router;
