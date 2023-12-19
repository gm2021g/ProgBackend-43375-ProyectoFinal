import express from "express";
import passport from "passport";
import upload from "../../utils/multer.js";
import {
  getLogin,
  getLogout,
  getRegister,
  getRestore,
  postLogin,
  postRegister,
  postRestore,
  getRestoreForm,
  postRestoreForm,
  changeUserRole,
  uploadDocument,
  loginUserGithub,
} from "../controller/users.controllers.js";

const Router = express.Router();

Router.get("/register", getRegister);

Router.get("/login", getLogin);

Router.post(
  "/register",
  passport.authenticate("register", { failureMessage: "not auth" }),
  postRegister
);

Router.post(
  "/login",
  passport.authenticate("login", { failureMessage: "not auth" }),
  postLogin
);

Router.get("/premium/:uid", changeUserRole);

Router.get("/logout", getLogout);

Router.get("/restore", getRestore);

Router.post("/restore", postRestore);

Router.get("/restoreForm/:uid/:token", getRestoreForm);

Router.post("/restoreForm/:uid/:token", postRestoreForm);

Router.post(
  "/:uid/documents",
  upload.fields([
    { name: "documents", maxCount: 3 },
    { name: "profiles", maxCount: 1 },
    { name: "products", maxCount: 10 },
  ]),
  uploadDocument
);

//login con github
Router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

Router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  loginUserGithub
);

export default Router;
