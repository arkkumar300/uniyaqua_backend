const multer = require("multer");
const GCSMulterStorage = require("../configs/gcsMulterStorage");
const { bucket } = require("../configs/gcpStorage");

// ---------- Storage engines (folders inside the bucket) ----------
const uploadImageStorage   = new GCSMulterStorage({ folder: "images" });
const uploadImagePdfStorage = new GCSMulterStorage({ folder: "image-pdf" });
const uploadPDFStorage     = new GCSMulterStorage({ folder: "pdfs" });
const uploadVideoStorage   = new GCSMulterStorage({ folder: "videos" });

// ---------- Filters ----------
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/i)) {
    return cb(new Error("Please upload a valid image file type"), false);
  }
  cb(null, true);
};

const importfileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(xlsx)$/i)) {
    return cb(new Error("Please upload a valid xlsx file only"), false);
  }
  cb(null, true);
};

const pdfFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(pdf|docx|ppt)$/i)) {
    return cb(new Error("Please upload a valid pdf file type"), false);
  }
  cb(null, true);
};

const videoFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(mov|mp4|avi|wmv)$/i)) {
    return cb(new Error("Please upload a valid video file type"), false);
  }
  cb(null, true);
};

const imagePdfFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
    return cb(new Error("Please upload a valid image or pdf file type"), false);
  }
  cb(null, true);
};

// ---------- Exports (same API as before) ----------
exports.uploadImage = multer({
  storage: uploadImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).single("image");

exports.uploadPDF = multer({
  storage: uploadPDFStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: pdfFilter,
}).single("file");

exports.uploadVideo = multer({
  storage: uploadVideoStorage,
  limits: { fileSize: 1024 * 1024 * 15 },
  fileFilter: videoFilter,
}).any("video");

exports.uploadBookandCover = multer({
  storage: uploadImagePdfStorage,
  limits: { fileSize: 1024 * 1024 * 15 },
  fileFilter: imagePdfFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "pdf",   maxCount: 1 },
]);

exports.uploadMultipleImage = multer({
  storage: uploadImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).fields([{ name: "imageUrl1" }, { name: "imageUrl2" }, { name: "imageUrl3" }]);

exports.uploadMultipleLabImage = multer({
  storage: uploadImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).fields([{ name: "labLogo" }, { name: "labImage" }, { name: "labReportImage" }]);

exports.uploadAnyImage = multer({
  storage: uploadImageStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
}).any();

exports.uploadAnyPdf = multer({
  storage: uploadImagePdfStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: imagePdfFilter,
}).any();

/**
 * Delete file from Google Cloud Storage
 */
exports.deleteFromGCS = async (fileUrlOrPath) => {
  if (!fileUrlOrPath) return;

  try {
    let objectPath = fileUrlOrPath;

    // Handle a full Google Cloud Storage URL
    if (
      fileUrlOrPath.startsWith("http://") ||
      fileUrlOrPath.startsWith("https://")
    ) {
      const parsedUrl = new URL(fileUrlOrPath);
      const marker = `/${bucket.name}/`;
      const index = parsedUrl.pathname.indexOf(marker);

      if (index === -1) {
        console.warn("URL does not belong to the configured bucket");
        return;
      }

      objectPath = decodeURIComponent(
        parsedUrl.pathname.substring(index + marker.length)
      );
    } else {
      objectPath = objectPath.replace(/^\/+/, "");
    }

    // Delete only if the object exists
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();

    if (exists) {
      await file.delete();
      console.log("Deleted old GCS file:", objectPath);
    }
  } catch (error) {
    console.error("Failed to delete old GCS file:", error);
    throw error;
  }
};

/**
 * Generate a V4 signed URL for uploading a file.
 * @param {string} originalName - The original name of the file (e.g., 'profile.jpg').
 * @param {string} mimeType - The MIME type of the file (e.g., 'image/jpeg').
 * @param {string} subFolder - The folder in the bucket (e.g., 'images', 'documents').
 * @param {number} maxSizeBytes - The maximum file size in bytes (e.g., 10 * 1024 * 1024 for 10MB).
 * @returns {Promise<{url: string, filePath: string, requiredHeaders: object}>}
 */
exports.getUploadSignedUrl = async (originalName, mimeType, subFolder = 'uploads', maxSizeBytes = 10 * 1024 * 1024) => {
  console.log("subfolder::", subFolder);
  console.log("originalName::", originalName);
  console.log("mimeType::", mimeType);
  const ext = path.extname(originalName);
  // const uniqueId = uuidv4();
  // const fileName = `${uniqueId}-${Date.now()}${ext}`;
  const filePath = `${subFolder}/${originalName}`;
  const file = bucket.file(filePath);

  const options = {
    version: 'v4',
    action: 'write', // 'write' is for uploads (PUT)
    expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    contentType: mimeType,
    // This header allows you to enforce a maximum file size on the client side.
    // The client MUST send this exact header with the same value when uploading.
    extensionHeaders: {
      'x-goog-content-length-range': `0,${maxSizeBytes}`,
    },
  };

  try {
    const [url] = await file.getSignedUrl(options);
    console.log(`✅ Generated signed upload URL for: ${filePath}`);

    // The client must send these headers when uploading to the signed URL.
    const requiredHeaders = {
      'Content-Type': mimeType,
      'x-goog-content-length-range': `0,${maxSizeBytes}`,
    };

    return {
      url,
      filename: originalName,
      filePath: `/${filePath}`,       // leading slash for DB storage
      requiredHeaders,
      fullUrl: `https://storage.googleapis.com/${bucket.name}/${filePath}`,
    };
  } catch (error) {
    console.error('❌ Failed to generate signed URL:', error);
    throw error;
  }
}
/**
 * Generate a V4 signed URL for reading/downloading a file.
 * @param {string} filePath - path inside the bucket (e.g. 'images/abc.webp')
 * @param {number} expiresInMs - expiry in ms (default 1 hour)
 */
exports.getReadSignedUrl = async (filePath, expiresInMs = 60 * 60 * 1000) => {
  let cleanPath = filePath;

  // If a complete URL is provided, extract the path after the bucket name
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    const url = new URL(filePath);
    const bucketName = bucket.name;
    const marker = `/${bucketName}/`;

    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      throw new Error(`Invalid file URL for bucket: ${bucketName}`);
    }

    cleanPath = url.pathname.substring(index + marker.length);
  }

  // Normalize: strip leading slash if present
  cleanPath = cleanPath.replace(/^\/+/, '');

  const file = bucket.file(cleanPath);

  const [exists] = await file.exists();

  if (!exists) {
    throw new Error(`File not found: ${cleanPath}`);
  }

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMs,
  });

  return url;
};

// Kept for backwards compatibility — now goes to GCS directly.
exports.cloudUploadTry = multer({ storage: uploadImageStorage }).single("image");