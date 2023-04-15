import jsonwebtoken from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  // const token = req.cookies.access_token;
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  // validasi token
  if (token == null)
    return res.status(401).json({ msg: "eror unauthorization" }); // 401 = unauthorization

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));

    req.user = user;

    next();
  });
};