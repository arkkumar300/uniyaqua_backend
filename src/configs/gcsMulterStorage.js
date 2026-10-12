// configs/gcsMulterStorage.js
const path = require("path");
const { bucket: defaultBucket } = require("./gcpStorage");

class GCSMulterStorage {
  /**
   * @param {object} opts
   * @param {string} [opts.folder]  - prefix inside the bucket, e.g. "images"
   * @param {boolean} [opts.public] - attempt to make object publicly readable
   */
  constructor(opts = {}) {
    this.bucket = opts.bucket || defaultBucket;
    this.folder = opts.folder || "";
    this.public = opts.public !== false;
  }

  _handleFile(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const filename = this.folder
      ? `${this.folder}/${file.fieldname}-${Date.now()}-${baseName}${ext}`
      : `${file.fieldname}-${Date.now()}-${baseName}${ext}`;

    const blob = this.bucket.file(filename);

    const writeStream = blob.createWriteStream({
      resumable: false,     // set true for very large files (>5MB)
      gzip: true,
      // Only works if the bucket does NOT use Uniform Bucket-Level Access.
      // If it does, remove this and grant `allUsers` → `Storage Object Viewer`
      // on the bucket via IAM, or serve with signed URLs.
      // predefinedAcl: this.public ? "publicRead" : undefined,
      metadata: {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000",
      },
    });

    file.stream
      .pipe(writeStream)
      .on("error", (err) => cb(err))
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
        cb(null, {
          bucket: this.bucket.name,
          filename,                 // used by _removeFile
          path: publicUrl,          // so req.file.path === public URL
          publicUrl,
          destination: `${this.bucket.name}/${filename}`,
        });
      });
  }

  _removeFile(req, file, cb) {
    this.bucket
      .file(file.filename)
      .delete()
      .then(() => cb(null))
      .catch((err) => cb(err));
  }
}

module.exports = GCSMulterStorage;