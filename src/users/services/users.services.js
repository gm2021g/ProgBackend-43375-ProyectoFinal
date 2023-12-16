import { CartServices } from "../../carts/services/carts.services.js";
import { ERRORS_ENUM } from "../../const/ERRORS.js";
import CustomError from "../../errors/customError.js";
import userModel from "../../models/user.model.js";
import { generateToken } from "../../utils/jwt.js";
import UserDto from "../dto/user.dto.js";
import { sendSuscriptionMail } from "../../mailer/controller/mailer.controller.js";
import path from "path";

class UserServices {
  finAll = async () => {
    try {
      const users = await userModel.find().lean().exec();

      const mapedUser = users.map((user) => new UserDto(user));

      return mapedUser;
    } catch (error) {
      console.log(error);
    }
  };

  findUser = async (email) => {
    try {
      const result = await userModel.findOne({ email }).lean().exec();

      const user = new UserDto(result);

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  findUserById = async (uid) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  registerUser = async (req, username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec();

      if (user) {
        return done(null, false);
      }

      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        password: await userModel.encryptPassword(password),
        cart: await CartServices.createCart(),
      };

      const createNewUser = await userModel.create(newUser);

      sendSuscriptionMail(req.body.email);

      return done(null, createNewUser);
    } catch (error) {
      console.log(error);

      return done(error);
    }
  };

  loginUser = async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec();

      if (!user) {
        console.log("User Not Found");

        return done(null, user);
      }

      const verifyPassword = await userModel.comparePassword(
        password,
        user.password
      );

      if (!verifyPassword) {
        console.log("Incorrect Password");

        return done(null, false);
      }

      const dtoUser = new UserDto(user);

      const token = generateToken(dtoUser);

      dtoUser.token = token;

      return done(null, dtoUser);
    } catch (error) {
      console.log(error);

      return done(error);
    }
  };

  logoutUser = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  changeRole = async (uid) => {
    try {
      const user = await this.findUserById(uid);

      if (!user) {
        return 1;
      }

      if (user.role !== "USER" && user.role !== "PREMIUM") {
        return 0;
      }

      if (user?.role === "USER") {
        const userDocuments = user?.documents.map((document) => {
          if (!document) {
            return 1;
          }

          const result = path.parse(document.name).name;
          return result;
        });

        if (
          !userDocuments?.includes("identificacion") &&
          !userDocuments?.includes("comprobante de domicilio") &&
          !userDocuments?.includes("comprobante de estado de cuenta")
        ) {
          return 3;
        }
      }

      const result = await userModel.updateOne(
        { _id: uid },
        {
          role:
            user.role === "USER"
              ? "PREMIUM"
              : user.role === "PREMIUM"
              ? "USER"
              : user.role,
        }
      );

      if (!result) return 1;

      return 2;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  updateLoginDate = async (id) => {
    return await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: { last_connection: Date.now() },
      },
      { new: true }
    );
  };

  updateUpload = async (_id, newDocument) => {
    try {
      const user = await userModel.findById({ _id }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      return await userModel.updateOne(
        { _id },
        { $push: { documents: newDocument } }
      );
    } catch (error) {
      console.log(error);
    }
  };
}

const UserService = new UserServices();

export default UserService;
