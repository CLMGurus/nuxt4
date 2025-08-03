import { defineEventHandler, getQuery, sendRedirect } from "h3";
import jwt from "jsonwebtoken";

const secret = process.env.ACCESS_TOKEN_SECRET!;

export default defineEventHandler(async (event) => {
  const { studyUid } = event.context.params!;
  const query = getQuery(event);
  //   const token = query.token as string;

  //   if (!token) {
  //     return new Response(`<h3>Token missing</h3>`, { status: 401 });
  //   }

  try {
    //const payload = jwt.verify(token, secret) as any;

    // if (payload.studyUid !== studyUid) {
    //   return new Response(`<h3>Unauthorized access</h3>`, { status: 403 });
    // }

    // Token valid → redirect to static OHIF viewer
    return sendRedirect(
      event,
      `/ohif/viewer?StudyInstanceUIDs=${studyUid}`,
      302
    );
  } catch (err) {
    return new Response(`<h3>Invalid or expired token</h3>`, { status: 403 });
  }
});
