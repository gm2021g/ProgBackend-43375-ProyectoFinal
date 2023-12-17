import { ERRORS_ENUM } from "../../const/ERRORS.js";
import CustomError from "../../errors/customError.js";
import { generateProductErrorInfo } from "../../errors/infoError.js";
import { ProductsServices } from "../services/products.services.js";

//Mostrar todos los productos
export const getAllProductsCtr = async (req, res) => {
  try {
    const { sort, query, page, limit } = req.query;
    const options = {
      limit: limit || 5,
      page: page || 1,
      sort: { price: sort } || { price: 1 },
      lean: true,
    };

    const products = await ProductsServices.getProducts(query, options);

    if (!products) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    res.send({
      status: "succes",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}&sort=${options.sort}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}&sort=${options.sort}`
        : null,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

//Traer un solo producto por id
export const getProductByIdCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductsServices.getProductById(pid);

    return res.status(200).send({
      payload: product,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const addNewProductCtr = async (req, res) => {
  try {
    const newProduct = req.body;
    const user = req.session.user;

    const { title, price, description, code, category } = newProduct;

    if (!title || !price || !description || !code || !category) {
      CustomError.createError({
        name: ERRORS_ENUM["INVALID PRODUCT PROPERTY"],
        message: generateProductErrorInfo(newProduct),
      });
    }

    console.log(newProduct);
    console.log(user);

    const result = await ProductsServices.addProduct(newProduct, user);

    if (!result) {
      CustomError.createError({
        message: ERRORS_ENUM["INVALID PRODUCT PROPERTY"],
      });
    }

    res.render("one", {
      product: newProduct,
      style: "style.css",
    });
  } catch (error) {
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

//Actualizar un producto
export const updateProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const updates = req.body;

    const result = await ProductsServices.updateProduct(pid, updates);

    if (!result) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(202).send({
      payload: result,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(400).send({ status: error.name, message: error.message });
  }
};

export const deleteProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;
    const user = req.session.user;

    const result = await ProductsServices.deleteProduct(pid, user);

    if (!result) {
      CustomError.createError({
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(202).send({
      payload: result,
    });
  } catch (error) {
    return res.status(400).send({ status: error.name, message: error.message });
  }
};
