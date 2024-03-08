import ApiErrors from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiReponse } from "../utils/ApiResponse.js";

const generateAccesTokenAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const accessToken = user.generateAccesToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Something went wrong");
  }
};

const register = asyncHandler(async (req, res) => {
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
  }

  return res
    .status(201)
    .json(new ApiReponse(201, "User created successfully", CreatedUser));
});

const login = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!email || !userName) {
    throw new ApiErrors(400, "Email and username are required");
  }

  const user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { userName: userName.toLowerCase() }],
  });

  if (!user) {
    throw new ApiErrors(404, "User not found");
  }

  const isMatch = await user.isPasswordMatch(password);

  if (!isMatch) {
    throw new ApiErrors(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(
    user._id
  );

  const userWithoutPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiReponse(
        200,
        {
          user: userWithoutPassword,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiReponse(200, "User logged out successfully"));
});

export { register, login, logOut };
