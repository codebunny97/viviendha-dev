// api/upload.js
// Vercel & Node compatible Serverless handler for media & PDF uploads
import fs from "node:fs";
import path from "node:path";
import { verifyToken, extractToken } from "./auth.js";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use POST." });
  }

  const token = extractToken(req);
  const user = token ? verifyToken(token) : null;
  if (!user || user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Admin credentials required for file upload.",
    });
  }

  try {
    const { fileData, fileName, fileType } = req.body || {};

    if (!fileData || !fileName) {
      return res.status(400).json({
        success: false,
        message: "Missing required upload data: fileData and fileName are required.",
      });
    }

    // Determine MIME type
    let mime = fileType;
    if (!mime && fileData.startsWith("data:")) {
      mime = fileData.substring(5, fileData.indexOf(";"));
    }

    if (mime && !ALLOWED_TYPES.includes(mime.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `File type ${mime} is not supported. Supported types: JPG, PNG, WEBP, SVG, PDF.`,
      });
    }

    // Extract base64 payload
    const base64Index = fileData.indexOf("base64,");
    const rawBase64 = base64Index !== -1 ? fileData.slice(base64Index + 7) : fileData;
    const fileBuffer = Buffer.from(rawBase64, "base64");

    if (fileBuffer.length > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: "File exceeds 15MB size limit.",
      });
    }

    // Sanitize filename
    const ext = path.extname(fileName) || (mime === "application/pdf" ? ".pdf" : ".png");
    const safeBase = path
      .basename(fileName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const finalFilename = `${Date.now()}-${safeBase}${ext}`;

    // Target upload directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, finalFilename);
      fs.writeFileSync(filePath, fileBuffer);

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        url: `/uploads/${finalFilename}`,
        fileName: finalFilename,
        size: fileBuffer.length,
        mimeType: mime,
      });
    } catch (fsErr) {
      console.warn("Could not write to public/uploads directory, using data URI fallback:", fsErr);
      // Fallback for read-only serverless runtimes: return full base64 data URI
      return res.status(200).json({
        success: true,
        message: "File processed successfully.",
        url: fileData,
        fileName: finalFilename,
        size: fileBuffer.length,
        mimeType: mime,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process uploaded file.",
    });
  }
}
