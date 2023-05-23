import UserManager from "../managers/users.js";
import { createHash, generateToken, isValidPassword } from "../utils/index.js";

export const login =
  ("/login",
  async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
      throw new Error("email y password invalidos");
    }

    const userManager = new UserManager();
    const user = await userManager.getOneByEmail(email);

    const isHashedPassword = await isValidPassword(password, user.password);

    if (!isHashedPassword) {
      return res
        .status(401)
        .send({ message: "Login failed, invalid password." });
    }

    user.rol =
      email === "adminCoder@coder.com" && password === "adminCod3r123"
        ? "admin"
        : "user";

    const accessToken = await generateToken(user);

    res.status(201).send({
      statud: "success",
      message: "Bienvenido!",
      accessToken,
    });
  });

export const logout =
  ("/logout/:id",
  async (req, res) => {
    req.session.destroy((err) => {
      if (!err) {
        return res.send({ message: "Logout ok!" });
      }

      res.send({ message: "Logout error!", body: err });
    });
  });

export const signup =
  ("/signup",
  async (req, res) => {
    const userManager = new UserManager();

    const data = {
      ...req.body,
      password: await createHash(req.body.password, 10),
    };

    const user = await userManager.create(data);

    res.status(201).send({ statud: "success", user, message: "user created" });
  });
