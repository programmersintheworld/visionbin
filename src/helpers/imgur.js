// import ImgurClient from "imgur";
// // import fs from "fs";
// // Connection to imgur
// const client = new ImgurClient({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
// });
// // Upload images
// export const uploadImage = async (base64) => {
//     const imageUploaded = await client.upload({
//         image: base64,
//         type: "base64",
//         name: "imageToBlog"
//     });
//     return imageUploaded;
// };
// // Update images
// // export const updateImage = async (image) => {
// //     const imageUploaded = await client.updateImage(image.path);
// //     fs.unlinkSync(image.path);
// //     return imageUploaded;
// // };
// // Delete images
// export const deleteImage = async (image) => {
//     const imageDeleted = await client.deleteImage(image);
//     return imageDeleted;
// };