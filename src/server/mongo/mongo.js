import { connect, set } from "mongoose";
import { config } from "../../config/config.js";
const { port, mongoose_uri } = config;

export const connectDB = async () => {
  try {
    set("strictQuery", false);
    await connect(mongoose_uri, { dbName: "ecommerce" });

    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
