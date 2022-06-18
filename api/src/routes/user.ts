import { Router } from "express";
import {
  deleteAccount,
  findUser,
  findUsers,
  register,
  updateUserProfile,
} from "../controller/user";

const route: Router = Router();

route.post("/", register);
route.get("/:id", findUser);
route.get("/", findUsers);
route.patch("/update-profile/:id", updateUserProfile);
route.delete("/:id", deleteAccount);
export default route;
