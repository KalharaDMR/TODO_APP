const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

const router = express.Router();

router.post("/register", async (req, res) => {

  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    username,
    password: hashedPassword
  };

  users.push(user);

  res.json({ message: "User registered" });

});

router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    "secretkey"
  );

  res.json({ token });

});

module.exports = router;