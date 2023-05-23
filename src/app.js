import dotenv from "dotenv";
dotenv.config();

import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import __dirname from "./dirname.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./managers/product.js";
import userRouter from "./routes/users.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const productManager = new ProductManager();

const app = express();
const httpServer = app.listen(8084, () => console.log("Escuchando..."));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/", viewsRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: "ACA VA EL STRING DE CONEXION",
      ttl: 1000,
    }),
    secret: "123123123",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("add", async (data) => {
    //await productManager.loadData()
    await productManager.addProduct(data);
    socket.emit("newList", await productManager.getProducts());
  });

  socket.on("delete", async (data) => {
    //await productManager.loadData()
    await productManager.deleteProduct(data);
    socket.emit("deleteProduct", await productManager.getProducts());
  });
});

mongoose
  .connect("ACA VA EL STRING DE CONEXION")
  .then(() => console.log("se conecto a la db"))
  .catch((error) => console.log(error));
