import JsonWebTokenError  from "jsonwebtoken";
import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.modal.js";

export const verifyJWt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new ApiErrors(401, "You are not logged in");
    }

    const decoded = JsonWebTokenError.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiErrors(404, "invalid token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiErrors(401, "invalid access");
  }
});
