import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    });

export const upload = async (file) => {
    try {
        const res = await cloudinary.uploader.upload(file, {
            folder: "ecommerce",
            resource_type: "auto",
            
        });
        const { secure_url } = res;
        return secure_url;
    } catch (error) {
        fs.unlinkSync(file);
        console.log(error);
    }
};

