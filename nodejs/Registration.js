  //App.js
//npm install passport passport-local

/* 


    What strategies are and how to use a local strategy to authenticate users with a username and password.

    How to configure the local strategy as middleware in passport.

    How to manage persistent logins using serializeUser() and deserializeUser().

    How to use the passport.authenticate() middleware for login endpoints.

    How to log out a user through the logout() function that’s exposed in the request object.

    Hash passwords before storing them in a database in order to protect your users from being hacked.

*/


const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const db = require("./db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
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

// Complete the logut handler below:
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("profile");
  }
);

app.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const newUser = await db.users.createUser({ username, password });
  if (newUser) {
    res.status(201).json({
      msg: "New user created!",
      newUser,
    });
  } else {
    res.status(500).json({ msg: "Unable to create user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



//Users.js
let records = [
    {
      id: 1,
      username: "sam",
      password: "codec@demy10",
    },
    {
      id: 2,
      username: "jill",
      password: "birthday",
    },
  ];
  
  const getNewId = (array) => {
    if (array.length > 0) {
      return array[array.length - 1].id + 1;
    } else {
      return 1;
    }
  };
  
  exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
      const newUser = {
        id: getNewId(records),
        ...user,
      };
      records = [newUser, ...records];
      console.log(records);
      resolve(newUser);
    });
  };
  
  exports.findById = function (id, cb) {
    process.nextTick(function () {
      var idx = id - 1;
      if (records[idx]) {
        cb(null, records[idx]);
      } else {
        cb(new Error("User " + id + " does not exist"));
      }
    });
  };
  
  exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
      for (var i = 0, len = records.length; i < len; i++) {
        var record = records[i];
        if (record.username === username) {
          return cb(null, record);
        }
      }
      return cb(null, null);
    });
  };


