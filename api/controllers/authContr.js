import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jsonwebtoken from "jsonwebtoken";

export const register = async (req, res, next) => {
  var {name, email, gender} = req.body;
  try {
    
    const user = await User.findOne({ email: req.body.email });
    if (user) return next(createError(400, "Email already registered!"));

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hash,
      gender: gender,
    });

    await newUser.save();

    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // membuat access token
    const accessToken = jsonwebtoken.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );

    // membuat refresh token
    const refreshToken = jsonwebtoken.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10800s",
      }
    );

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      refresh_token: refreshToken,
    });
    
    const { password, ...otherDetails } = user._doc;
    res
      .cookie("refresh_token", refreshToken, { httpOnly: true })
      .status(200)
      .json({ msg: "login succes!", id: user._id, accessToken: accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  try {
    // ambil value token dari cookie
    const refreshToken = req.cookies.refresh_token;
    // validasi token
    if (!refreshToken) return res.status(204).json({ msg: "token eror" }); // 204 = no content

    const user = await User.findOne({ refresh_token: refreshToken });

    // compare token dg token db
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      refresh_token: null,
    });

    // hapus refresh token pada cookie
    res.clearCookie("refresh_token");
    // kirim response
    return res.status(200).json({ msg: "logout succes!" });
  } catch (error) {
    console.log(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken)
      return res.status(401).json({ msg: "eror 401 get refresh token!" }); // 401 = unauthorization
    
    const user = await User.findOne({ refresh_token: refreshToken });

    // jika token tidak cocok
    if (!user)
      return res
        .status(403)
        .json({ msg: "eror 403 get refresh token no user!" }); // 403 = forbidden

    // jika token cocok
    jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403); // 403 = forbidden

      const accessToken = jsonwebtoken.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "3600s",
        }
      );
      
        res.json({ id: user._id, accessToken: accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};