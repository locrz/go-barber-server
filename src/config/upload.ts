import multer from "multer";
import path from "path";
import crypto from "crypto";

const tmpDir = path.resolve(__dirname, "..", "..", "tmp");

export default {
  tmpDirectory: tmpDir,
  uploadDirectory: path.resolve(tmpDir, "uploads"),

  storage: multer.diskStorage({
    destination: tmpDir,
    filename(request, file, callback) {
      const originalNameWithoutSpaces = file.originalname.replace(/\s/g, "");

      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${originalNameWithoutSpaces}`;

      return callback(null, fileName);
    },
  }),
};
