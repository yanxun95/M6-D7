import express from "express"
import createHttpError from "http-errors"
import BlogModel from "./schema.js"
import CommentModel from "../comments/schema.js"
import mongoose from "mongoose"
import commentSchema from "../comments/schema.js"

const blogRouter = express.Router()

blogRouter.post("/", async (req, res, next) => {
    try {
        const newblog = new BlogModel(req.body) // here happens validation of the req.body, if it is not ok Mongoose will throw a "ValidationError"
        const { _id } = await newblog.save() // this is where the interaction with the db/collection happens

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/", async (req, res, next) => {
    try {
        const blogs = await BlogModel.find().populate('comments')

        res.send(blogs)
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId

        const blog = await BlogModel.findById(blogId).populate('comments') // similar to findOne, but findOne expects to receive a query as parameter

        if (blog) {
            res.send(blog)
        } else {
            next(createHttpError(404, `blog with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.put("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId
        const modifiedblog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
            new: true, // returns the modified blog
        })

        if (modifiedblog) {
            res.send(modifiedblog)
        } else {
            next(createHttpError(404, `blog with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.delete("/:blogId", async (req, res, next) => {
    try {
        const blogId = req.params.blogId

        const deletedblog = await BlogModel.findByIdAndDelete(blogId)

        if (deletedblog) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `blog with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.post("/:blogId/comment", async (req, res, next) => {
    try {
        const newComment = new CommentModel(req.body)
        const { _id } = await newComment.save()

        const updatedblog = await BlogModel.findByIdAndUpdate(
            req.params.blogId, // WHO we want to modify
            { $push: { comments: mongoose.Types.ObjectId(_id) } }, // HOW we want to modify him/her
            { new: true })

        if (updatedblog) {
            res.send(updatedblog)
        } else {
            next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
        }
        // const obj = {
        //     name: "test",b
        //     id: "qasd"
        // }
        // let { id } = obj //id = qasd
        // let name = obj
        // name = {
        //     name: "test",
        //         id: "qasd"
        // }
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/:blogId/comments", async (req, res, next) => {
    try {
        const blogId = req.params.blogId

        const blog = await BlogModel.findById(blogId, { "comments": 1, "_id": 0 }).populate('comments')
        if (blog) {
            res.send(blog)
        } else {
            next(createHttpError(404, `blog with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
    try {
        const commentId = req.params.commentId

        const comment = await CommentModel.findById(commentId) // similar to findOne, but findOne expects to receive a query as parameter
        if (comment) {
            res.send(comment)
        } else {
            next(createHttpError(404, `Comment with id ${commentId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            req.params.commentId, // WHO we want to modify
            req.body, // HOW we want to modify him/her
            { new: true })

        if (updatedComment) {
            res.send(updatedComment)
        } else {
            next(createHttpError(404, `Comment with id ${req.params.commentId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
    try {
        const commentId = req.params.commentId

        const deletedComment = await CommentModel.findByIdAndDelete(commentId)
        await BlogModel.findByIdAndUpdate(
            req.params.blogId, // WHO we want to modify
            { $pull: { comments: mongoose.Types.ObjectId(commentId) } }, // HOW we want to modify him/her
            { new: true })

        if (deletedComment) {
            res.status(204).send(`${commentId} has been delete!`)
        } else {
            next(createHttpError(404, `Comment with id ${commentId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})




export default blogRouter