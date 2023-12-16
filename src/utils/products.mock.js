import { faker } from "@faker-js/faker";

export const generateProducts = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.number.int({ min: 1, max: 100000 }),
    price: faker.commerce.price(),
    status: faker.datatype.boolean({ probability: 0.1 }),
    stock: faker.number.int({ min: 0, max: 1000 }),
    category: faker.commerce.department(),
    thumbnails: [faker.image.urlPicsumPhotos()],
  };
};
