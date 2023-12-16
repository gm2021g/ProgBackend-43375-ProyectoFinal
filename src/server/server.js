import express from "express";
import handlebars from "express-handlebars";
import { connectDB } from "./mongo/mongo.js";
import { config } from "../config/config.js";
import __dirname from "../dirname.js";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "../users/routes/sessions.routes.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "../config/passport.config.js";
import productsRouter from "../products/router/products.routes.js";
import cartsRouter from "../carts/router/carts.routes.js";
import { Server } from "socket.io";
import socket from "./socket.js";
import chatRouter from "../messages/routes/messages.router.js";
import productsMockRouter from "../mocks/routes/productsMock.routes.js";
import { viewsRouter } from "../routes/index.js";
import authRouter from "../users/routes/users.routes.js";
import { errorHandler } from "../middlewares/errors/index.js";
import loggerRouter from "../logger/routes/logger.router.js";
import { addLogger } from "../utils/logger.js";
import initSwagger from "./swagger.js";
import swaggerUiExpress from "swagger-ui-express";
import apiUserRouter from "../users/routes/apiUser.routes.js";

const app = express();

//mongo connect
connectDB();

//public folder config and middlewares
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoose_uri,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200, // tiempo de visa de la sesión
    }),
    secret: config.client_secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(
  "/api/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(initSwagger())
);

//handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
app.use(addLogger);

//routes
app.use("/", authRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", apiUserRouter);
app.use("/chat", chatRouter);
app.use("/create", productsRouter);
app.use("/", productsMockRouter);
app.use("/loggerTest", loggerRouter);

//server
const httpServer = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}!`);
});

//socket
const io = new Server(httpServer);
socket(io);
