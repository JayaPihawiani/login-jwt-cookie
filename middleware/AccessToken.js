import jwt from "jsonwebtoken";

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "FORBIDDEN ACCESS" });
    req.user = decoded;
    next();
  });
};

export default tokenVerify;
