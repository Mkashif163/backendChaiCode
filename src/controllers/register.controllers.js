import ApiErrors from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiReponse} from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiErrors(409, "Email or username already exists");
  }

  const avatarPath = req.files?.avatar?.path;

  const coverPhotoPath = req.files?.coverPhoto?.path;

  if (!avatarPath || !coverPhotoPath) {
    throw new ApiErrors(400, "All fields are required");
  }
  const avatar = await uploadOnCloudinary(avatarPath);
  const coverPhoto = await uploadOnCloudinary(coverPhotoPath);

  const user = await User.create({
    fullname,
    avatar: avatar,
    coverPhoto: coverPhoto || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const CreatedUser = await User.findById(user._id).select(
  "-password -refreshToken"
  );

  if (!CreatedUser) {
    throw new ApiErrors(500, "Something went wrong");
  };

  return res.status(201).json(
    new ApiReponse(201, "User created successfully", CreatedUser)
  )
});
