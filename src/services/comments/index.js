import express from "express"
import createHttpError from "http-errors"
import BlogModel from "./schema.js"
import commentSchema from "../comments/schema.js"

const commentRouter = express.Router()