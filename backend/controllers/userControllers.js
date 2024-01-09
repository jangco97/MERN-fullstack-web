const { validationResult } = require("express-validator");

const HttpError = require("../models/httpError");
const User = require("../models/userSchema");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "유저 정보를 불러올 수 없습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "유효하지 않은 입력값을 보냈습니다. 다시 확인해주세요.",
        422
      )
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "이미 존재하는 유저입니다. 다시 시도해주세요.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.",
      401
    );
    return next(error);
  }

  res.json({ message: "로그인에 성공했습니다." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
