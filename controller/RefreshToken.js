import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.findAll({ where: { refresh_token: refreshToken } });
    if (!user[0]) return res.sendStatus(403);
    // action

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const { id, name, email } = user[0];
      const accessToken = jwt.sign(
        { id, name, email },
        process.env.ACCESS_SECRET,
        { expiresIn: "15s" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.json(error);
  }
};
