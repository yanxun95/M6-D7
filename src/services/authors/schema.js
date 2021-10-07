import mongoose from "mongoose"

const { Schema, model } = mongoose

const authorSchema = new Schema(
    {
        name: { type: String, required: true },
        avatar: { type: String }
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
)

export default model("Author", authorSchema)