import mongoose from "mongoose"

const { Schema, model } = mongoose

const commentSchema = new Schema(
    {
        comment: { type: String, required: true },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
)

export default model("Comment", commentSchema)