import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.json({ msg: error });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // validate
    if (!name || !email || !password || !confirmPassword)
      return res
        .status(400)
        .json({ msg: "Field ada yang kosong. Harap isi semua field!" });
    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail)
      return res.status(400).json({ msg: "Email ini sudah terdaftar." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password kurang panjang, minimal 8 karakter!" });
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ msg: "Password dan konfirmasi password tidak cocok!" });
    // action
    const hash = await argon2.hash(password);
    await User.create({ name, email, password: hash });
    res.status(201).json({ msg: "Berhasil membuat akun." });
  } catch (error) {
    res.json({ msg: error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //   validate
  if (!email || !password)
    return res
      .status(400)
      .json({ msg: "Field ada yang kosong. Harap isi semua field!" });
  try {
    const checkEmail = await User.findOne({ where: { email } });
    if (!checkEmail)
      return res
        .status(404)
        .json({ msg: "User dengan email ini tidak ditemukan!" });
    const verifyPassword = await argon2.verify(checkEmail.password, password);
    if (!verifyPassword)
      return res.status(400).json({ msg: "Password yang dimasukkan salah!" });
    // action
    const id = checkEmail.id;
    const userName = checkEmail.name;
    const userEmail = checkEmail.email;
    // token
    const accessToken = jwt.sign(
      { id, userName, userEmail },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "25s",
      }
    );
    const refreshToken = jwt.sign(
      { id, userName, userEmail },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "8h",
      }
    );
    await User.update(
      {
        refresh_token: refreshToken,
      },
      { where: { id } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8,
    });
    res.json({ accessToken });
  } catch (error) {
    res.json({ msg: error });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({ where: { refresh_token: refreshToken } });
    if (!user[0]) return res.sendStatus(204);
    await User.update(
      { refresh_token: null },
      {
        where: {
          id: user[0].id,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    res.json(error);
  }
};
