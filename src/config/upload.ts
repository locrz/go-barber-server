import multer, { StorageEngine } from "multer";
import path from "path";
import crypto from "crypto";

const tmpDir = path.resolve(__dirname, "..", "..", "tmp");

interface IStorageConfig {
  driver: "s3" | "disk";

  tmpDirectory: string;
  uploadDirectory: string;

  multer: { storage: StorageEngine };

  config: { disk: {}; aws: { bucket: string } };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpDirectory: tmpDir,
  uploadDirectory: path.resolve(tmpDir, "uploads"),

  multer: {
    storage: multer.diskStorage({
      destination: tmpDir,
      filename(request, file, callback) {
        const originalNameWithoutSpaces = file.originalname.replace(/\s/g, "");

        const fileHash = crypto.randomBytes(10).toString("hex");
        const fileName = `${fileHash}-${originalNameWithoutSpaces}`;

        return callback(null, fileName);
      },
    }),
  },

  config: { disk: {}, aws: { bucket: "app-gobarber09" } },
} as IStorageConfig;
