import mongoose from "mongoose"

const { Schema, model } = mongoose

const userSchema = new Schema(
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
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
)

export default model("User", userSchema)