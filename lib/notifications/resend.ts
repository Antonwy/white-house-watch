import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;

if (!key) {
  throw new Error("RESEND_API_KEY is not set");
}

export const resend = new Resend(key);