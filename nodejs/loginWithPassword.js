//npm install passport passport-local
const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Look up user id in database.
  db.users.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", (req, res) => {
  // Pass user object stored in session to the view page:
  res.render("profile", { user: req.user });
});

// Add the passport middleware below:
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("profile");
  }
);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});