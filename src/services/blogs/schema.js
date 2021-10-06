import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogSchema = new Schema(
    {
        category: { type: String, required: true },
        title: { type: String, required: true },
        cover: { type: String },
        readTime: {
            value: { type: Number, required: true },
            unit: { type: Number }
        },
        author: {
            name: { type: String, required: true },
            avatar: { type: String }
        },
        content: { type: String, required: true },
        comments: [{ type: Schema.ObjectId, ref: "Comment" }],
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
)

export default model("Blog", blogSchema) // bounded to the "blog" collection, if the collection is not there it is automatically created