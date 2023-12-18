import express from "express";
import {
  changeUserRole,
  getAllUsers,
  deleteUser,
  getUserById,
  changeRole,
  deleteAllUsersInactivity,
} from "../controller/users.controllers.js";
import { authPolicies } from "../../utils/jwt.js";

const Router = express.Router();

Router.get("/", authPolicies("ADMIN"), getAllUsers);

Router.get("/:uid", getUserById);

Router.delete("/deleteuser/:uid", deleteUser);

Router.get("/premium/:uid", changeUserRole);

Router.put("/:uid/role/:role", changeRole);

Router.delete("/delete", deleteAllUsersInactivity);

export default Router;
