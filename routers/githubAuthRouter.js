const passport = require("../socialAuth/githubAuth");
const githubAuthRouter = require("express").Router();
const { authSocial } = require("../methods/authMehods");

githubAuthRouter.use(passport.initialize());
githubAuthRouter.use(passport.session());

githubAuthRouter.get("/auth", passport.authenticate("github", { scope: ["user:email"] }));

githubAuthRouter.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/github/success",
    failureRedirect: "/?auth=errorAuth",
  })
);

githubAuthRouter.get("/success", authSocial());

module.exports = githubAuthRouter;
