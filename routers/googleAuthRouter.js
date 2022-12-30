const passport = require("../socialAuth/googleAuth");
const googleRouter = require("express").Router();
const { authSocial } = require("../methods/authMehods");

googleRouter.use(passport.initialize());
googleRouter.use(passport.session());

googleRouter.get("/auth", passport.authenticate("google", { scope: ["email", "profile"] }));

googleRouter.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/google/success",
    failureRedirect: "/?auth=errorAuth",
  })
);

googleRouter.get("/success", authSocial());

module.exports = googleRouter;
