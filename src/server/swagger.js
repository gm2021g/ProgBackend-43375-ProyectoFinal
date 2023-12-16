import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../dirname.js"; //"./utils.js";
//import __dirname from "../../dirname.js";
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion",
      description: "Documentacion del ecommerce Fragances Shop",
    },
  },
  apis: [`${__dirname}/./docs/**/*.yaml`],
};

const initSwagger = () => {
  const specs = swaggerJSDoc(swaggerOptions);
  return specs;
};

export default initSwagger;
