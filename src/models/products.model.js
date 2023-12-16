import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: {
    type: Boolean,
    default: true,
  },
  size: Number,
  stock: {
    type: Number,
    index: true,
    default: 0,
  },
  category: {
    type: String,
    index: true,
  },
  thumbnail: {
    type: [String],
    default: [],
  },
  owner: {
    type: String,
    default: "ADMIN",
  },
});

mongoosePaginate.paginate.options = {
  limit: 10,
  page: 1,
  sort: { price: 1 },
  lean: true,
};

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;
