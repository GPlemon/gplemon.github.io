const express = require("express");
const router = express.Router();
const helper = require("../helpers/helpers");
let users = require("../data/users.json");
const filename = "./data/users.json";
const bcrypt = require("bcrypt");

/* Register a user */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const id = { id: helper.getNewId(users) };

  try {
    const user = await helper.findUser(users, email);

    if (user) {
      console.log("User already exists!");
      return res.redirect("login");
    }
      
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      ...id,
      email,
      password: hashedPassword,
    };

    await users.push(newUser);
    await helper.writeJSONFile(filename, users);

    res.redirect("login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Log in user */
router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await helper.findUser(users, email);

    if (!user) {
      console.log("User does not exist!");
      return res.redirect("login");
    }

    // Compare passwords:
    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      console.log("Passwords did not match!");
      return res.redirect("login");
    }

    res.render("profile", { user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = router;
