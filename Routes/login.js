const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Login = require("../Models/signUp");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const user = await Login.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(404).send("wrong email");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(404).send("invalid password");
  }

  const token = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_TOKEN_SECRET
  );

  res.header("authorization", token).status(200).send({
    token: token,
    user: user._id,
    role: user.role
  });
});

module.exports = router;
