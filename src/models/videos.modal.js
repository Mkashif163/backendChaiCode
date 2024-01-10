import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title : {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description : {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    duration : {
        type: Number,
        required: true,
        trim: true,
        minlength: 3
    },
    views : {
        type: Number,
        required: true,
        trim: true,
        minlength: 3
    },
    isPublic : {
        type: Boolean,
        required: true,
        trim: true,
        minlength: 3
    },

},{timestamps: true});


export const Video = mongoose.model("Video", videoSchema);