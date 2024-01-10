import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    watchHistory: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Video'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    coverPhoto: {
        type: String,
        required: false,
        trim: true,
        minlength: 3
    },
    avatar: {
        type: String,
        required: false,
        trim: true,
        minlength: 3
    },
    refreshToken: {
        type: String,
        required: false,
        trim: true,
        minlength: 3
    },
    
},{timestamps: true});

export const User = mongoose.model("User", userSchema);