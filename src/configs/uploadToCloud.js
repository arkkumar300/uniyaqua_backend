// configs/uploadToCloud.js
const path = require("path");
const fs = require("fs/promises");
const { bucket } = require("./gcpStorage");

/**
 * Upload a local file to GCS, delete it locally, return its public URL.
 * @param {string} locaFilePath - path relative to "public/" or an absolute path
 */
const uploadToCloud = async (localFilePath) => {
  console.log("localFilePath:", localFilePath);

  try {
    if (!localFilePath || !(await fileExists(localFilePath))) {
      throw new Error(`Local file does not exist: ${localFilePath}`);
    }

    const fileName = path.basename(localFilePath);
    const destination = `public/${Date.now()}-${fileName}`;

    await bucket.upload(localFilePath, {
      destination,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    // Delete the temporary file after successful upload
    await fs.unlink(localFilePath);

    return {
      message: "Success",
      url: `https://storage.googleapis.com/${bucket.name}/${destination}`,
    };
  } catch (error) {
    console.error("GCS upload failed:", error);

    throw error;
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

module.exports = uploadToCloud;