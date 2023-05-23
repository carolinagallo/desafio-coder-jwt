import UserManager from "../managers/users.js";
import userValidation from "../validations/userValidations.js";

export const list =
  ("/",
  async (req, res) => {
    try {
      const { limit, page } = req.query;

      const userManager = new UserManager();

      const users = await userManager.paginate({ limit, page });

      res.send({
        status: "success",
        users: users.docs,
        ...users,
        docs: undefined,
      });
    } catch (e) {
      next(e);
    }
  });

export const getOne =
  ("/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const userManager = new UserManager();

      const user = await userManager.getOne(id);

      res.send({ status: "success", user });
    } catch (e) {
      next(e);
    }
  });

export const save =
  ("/",
  async (req, res) => {
    try {
      const data = req.body;

      await userValidation.parseAsync(req.body);
      const userManager = new UserManager();

      const user = await userManager.create(data);

      res.send({ status: "success", user, massage: "user created" });
    } catch (e) {
      next(e);
    }
  });

export const update =
  ("/:id",
  async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      await userValidation.parseAsync(req.body);

      const userManager = new UserManager();

      const user = await userManager.updateOne(id, data);

      res.send({ status: "success", user, massage: "user updated" });
    } catch (e) {
      next(e);
    }
  });

export const deleteOne =
  ("/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const userManager = new UserManager();

      await userManager.deleteOne(id);

      res.send({ status: "success", massage: "user deleted" });
    } catch (e) {
      next(e);
    }
  });
