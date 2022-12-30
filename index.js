require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const { MongoClient } = require("mongodb");
const { auth, authRedirect, logout, signup, login } = require("./methods/authMehods");
const { nanoid } = require("nanoid");
const cookieParser = require("cookie-parser");
const noteRouter = require("./routers/noteRouter");
const googleAuthRouter = require("./routers/googleAuthRouter");
const githubAuthRouter = require("./routers/githubAuthRouter");
const sessions = require("express-session");

let client = new MongoClient(process.env.DB_URI);

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("public"));
app.use(sessions({ secret: nanoid() }));
app.use(express.json());
app.use(cookieParser());
app.use(async (req, res, next) => {
  req.db = client.db("notes_app");
  next();
});
app.set("view engine", "njk");

app.get("/", auth(), authRedirect(), (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", auth(), (req, res) => {
  if (!req.user) return res.redirect("/");
  res.render("dashboard", { username: req.user.login });
});

app.post("/login", bodyParser.urlencoded({ extended: true }), login());
app.post("/signup", bodyParser.urlencoded({ extended: true }), signup());
app.get("/logout", auth(), logout());

app.use("/github", githubAuthRouter);
app.use("/google", googleAuthRouter);
app.use("/notes", noteRouter);

const port = process.env.PORT || 9000;

client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`     Server listen on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.err(err);
  });
