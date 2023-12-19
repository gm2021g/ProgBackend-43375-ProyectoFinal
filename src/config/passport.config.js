// GENERAR LOGICA PARA TRABAJAR CON PASSPORT JWT, LOCAL Y GITHUB
import passport from "passport";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import GitHubStrategy from "passport-github2";
import UserService from "../users/services/users.services.js";
import { cookieExtractor } from "../utils/jwt.js";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const JwtExtractor = passportJwt.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;
const { registerUser, loginUser } = UserService;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      (req, username, password, done) =>
        registerUser(req, username, password, done)
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (username, password, done) => loginUser(username, password, done)
    )
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: JwtExtractor.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          console.log(error);

          return done(error);
        }
      }
    )
  );

  //passport Github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.5c71880f9e9e6f94",
        clientSecret: "78db4227ce746b0c61c8321141d859f6d657a4dd",
        callbackURL: "http://localhost:8080/auth/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const findUser = await userModel.getUserByEmail({
            email: profile._json.email,
          });

          if (findUser) {
            return done(null, findUser);
          }

          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          };

          const result = await userModel.userCreate(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error to register", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);

    done(null, user);
  });
};

export default initializePassport;
