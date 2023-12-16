import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoose_uri: process.env.MONGOOSE_URI,
  client_secret: process.env.CLIENT_SECRET,
  cb_url: process.env.CB_URL,
  email: process.env.EMAIL,
  email_pass: process.env.EMAIL_PASS,
};
