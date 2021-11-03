import express from "express";
import AuthorModel from "./schema.js";
import BlogModel from "../blogs/schema.js";
import { basicAuthMiddleware } from "../auth/basic.js";
import { JWTAuthenticate } from "../auth/tools.js";
import { JWTAuthMiddleware } from "../auth/token.js";
import createHttpError from "http-errors";

const authorRouter = express.Router();

authorRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    console.log("id:", req.user._id);
    const posts = await BlogModel.find({ authors: req.user._id.toString() });

    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

authorRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Get email and password from req.body
    const { email, password } = req.body;

    // 2. Verify credentials
    const user = await AuthorModel.checkCredentials(email, password);

    if (user) {
      // 3. If credentials are ok we are going to generate access token and refresh token
      const accessToken = await JWTAuthenticate(user);

      // 4. Send token back as a response
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});
export default authorRouter;
