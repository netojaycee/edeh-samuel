import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

const PUBLIC_ID = "resume";

export async function deleteOldResume() {
  try {
    await cloudinary.uploader.destroy(PUBLIC_ID, { resource_type: "raw" });
  } catch {}
}

export async function uploadResume(buffer: Buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: PUBLIC_ID,
        resource_type: "raw",   // PDFs work as "image" in Cloudinary
        overwrite: true,
        invalidate: true,
        format: "pdf",
        type: "upload",           // ensures public
        access_mode: "public"     // ← Force public          // ensures .pdf extension
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}