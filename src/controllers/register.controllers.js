import {asyncHandler} from "../utils/asynHandler.js";


export const register = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "Register ok",
    });
});
