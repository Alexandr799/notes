const crypto = require("crypto");
const { findInDataBase, pushInDatabase, deleteInDataBase } = require("./methodsDB");
const { nanoid } = require("nanoid");

const hash = (word) => crypto.createHash("sha256").update(word).digest("hex");

const messageAuthError = {
  errorAuth: "Ошибка авторизации!",
  errorSignup: "Ошибка регистрации логин и пароль должны быть длинее 1 символа!",
  loginSignupError: "Имя пользователя занято!",
};

const auth = () => async (req, res, next) => {
  if (!req.cookies.token) {
    return next();
  }
  const session = await findInDataBase(req.db, "sessions", { token: req.cookies.token });
  if (!session) {
    return next();
  }
  const user = await findInDataBase(req.db, "users", { id: session.userId });
  if (!user) {
    return next();
  }
  req.user = user;
  req.token = req.cookies.token;
  next();
};

const authRedirect = () => (req, res, next) => {
  if (!req.user) {
    let errorMessage = messageAuthError[req.query.auth];
    let validMassage = false;
    if (!errorMessage) {
      validMassage = req.query.auth === "successSignup" ? "Вы успешно зарегистрировались!" : false;
    }
    return res.render("index", { authError: errorMessage, validMassage });
  }
  next();
};

const authWarningInit = () => (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Ошибка авторизации");
  }
  next();
};

const authSocial = () => async (req, res) => {
  try {
    if (!req.user || !req.user.login) return res.redirect("/?auth=errorAuth");
    const user = await findInDataBase(req.db, "users", { login: req.user.login });
    if (user) {
      const token = nanoid();
      await pushInDatabase(req.db, "sessions", { userId: user.id, id: nanoid(), token });
      res.cookie("token", token);
      return res.redirect("/");
    }
    const userId = nanoid();
    await pushInDatabase(req.db, "users", { id: userId, login: req.user.login, social: req.user.social });
    const token = nanoid();
    await pushInDatabase(req.db, "sessions", { userId: userId, id: nanoid(), token });
    res.cookie("token", token);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
};

const logout = () => async (req, res) => {
  try {
    if (!req.user) return res.redirect("/");
    await deleteInDataBase(req.db, "sessions", { token: req.token });
    res.clearCookie("connect.sid");
    res.clearCookie("token").redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
};

const signup = () => async (req, res) => {
  try {
    const login = req.body.username;
    const password = req.body.password;
    if (!login || !password) {
      return res.redirect("/?auth=errorSignup");
    }
    const user = await findInDataBase(req.db, "users", { login });
    if (user) {
      return res.redirect("/?auth=loginSignupError");
    }
    const userId = nanoid();
    await pushInDatabase(req.db, "users", { id: userId, login, password: hash(password) });
    res.redirect("/?auth=successSignup");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
};

const login = () => async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await findInDataBase(req.db, "users", { login: username });
    if (!user || hash(password) !== user.password) {
      return res.redirect("/?auth=errorAuth");
    }
    const token = nanoid();
    await pushInDatabase(req.db, "sessions", { userId: user.id, id: nanoid(), token });
    res.cookie("token", token);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
};

module.exports = {
  hash,
  auth,
  authRedirect,
  authWarningInit,
  authSocial,
  logout,
  signup,
  login,
};
