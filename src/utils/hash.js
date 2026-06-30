import crypto from "crypto";

export const hash = (value) =>
    crypto.createHash("sha256").update(value).digest("hex");