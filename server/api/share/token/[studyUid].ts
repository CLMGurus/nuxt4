import { defineEventHandler, getQuery } from "h3";
import jwt from "jsonwebtoken";

const secret = process.env.ACCESS_TOKEN_SECRET!;

export default defineEventHandler(async (event) => {
  const { studyUid } = event.context.params!;
  if (!studyUid) {
    return { error: "Missing study UID" };
  }

  const token = jwt.sign(
    {
      studyUid,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes expiry
    },
    secret
  );

  return { token };
});
