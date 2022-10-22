const sharp = require("sharp");
const path = require("path")
const fs = require("fs")

const outputFolder = "public/assets";

module.exports = async (req, res, next) => {
    const images = [];

    console.log("Image Resize middleware is called");
    const thumbnail = await sharp(req.files[0].buffer)
        .resize(100)
        .jpeg({quality: 30})
        .toBuffer();

    console.log("Thumbnail", thumbnail);
    const thumbnailHigh = await sharp(req.files[0].buffer)
        .resize(500)
        .jpeg({quality: 30})
        .toBuffer();
    console.log("Thumbnail High", thumbnailHigh);

    resizePromises = req.files.map(async (file) => {
            const image = await sharp(file.buffer)
                .resize(1000)
                .jpeg({quality: 50})
                .toBuffer()
            images.push(image);
        }
    );

    await Promise.all([...resizePromises]);

    req.thumbnail = thumbnail;
    req.thumbnailHigh = thumbnailHigh;
    req.images = images;

    console.log("Image", images[0]);

    next();
};
