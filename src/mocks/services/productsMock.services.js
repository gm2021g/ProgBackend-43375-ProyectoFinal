import { generateProducts } from "../../utils/products.mock.js";

export const saveGeneratedProducts = () => {
  const productstQuantity = 100;
  const products = [];

  for (let i = 0; i <= productstQuantity; i++) {
    products.push(generateProducts());
  }

  return products;
};
