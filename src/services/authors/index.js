import express from "express";
import authorSchema from "./schema.js";
import BlogModel from "../blogs/schema.js";
import { basicAuthMiddleware } from "../auth/basic.js";

const authorRouter = express.Router();

authorRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new authorSchema(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// authorRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
//   try {
//     console.log("this is the id", req.user._id);
//     // const blogs = await BlogModel.find().populate("comments");
//     const blogs = await BlogModel.authors.findById(req.user._id);

//     res.send(blogs);
//   } catch (error) {
//     next(error);
//   }
// });

export default authorRouter;
