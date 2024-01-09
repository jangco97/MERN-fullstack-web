const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "비밀번호를 암호화하는데 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    password: hashedPassword,
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

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    ); //몽고db가 자동으로 생성한 id를 사용자의 id로 사용
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    const error = new HttpError(
      "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "로그인에 실패했습니다. 비밀번호를 확인해주세요.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    ); //몽고db가 자동으로 생성한 id를 사용자의 id로 사용
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 다시 시도해주세요.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
