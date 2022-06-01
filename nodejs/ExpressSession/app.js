const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const db = require("./db");
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

function ensureAuthentication(req, res, next) {
  // Complete the if statmenet below:
  if (req.session.authenticated) {
    return next();
  } else {
    res.status(403).json({ msg: "You're not authorized to view this page" });
  }
}

// Add your ensureAuthentication middleware below:
app.get("/shop", ensureAuthentication, (req, res) => {
  // Send the user object to the view page:
  res.render("shop", { user: req.session.user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// POST request for logging in
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.users.findByUsername(username, (err, user) => {
    if (!user) return res.status(403).json({ msg: "No user found!" });
    if (user.password === password) {
      req.session.authenticated = true;
      req.session.user = {
        username,
        password,
      };
      res.redirect("/shop");
    } else {
      res.status(403).json({ msg: "Bad Credentials" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// const session = require("express-session");
// const store = new session.MemoryStore();
// const db = require("./db");
// const PORT = process.env.PORT || 4001;

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

// app.use(
//   session({
//     secret: "f4z4gs$Gcg",
//     cookie: { maxAge: 300000000, secure: false },
//     saveUninitialized: false,
//     resave: false,
//     store,
//   })
// );

// function ensureAuthentication(req, res, next) {
//   // Complete the if statmenet below:
//   if (req.session.authenticated) {
//     console.log(req.session);
//     return next();
//   } else {
//     res.status(403).json({ msg: "You're not authorized to view this page" });
//   }
// }

// // Add your ensureAuthentication middleware below:
// app.get("/shop", ensureAuthentication, (req, res) => {
//   // Send the user object to the view page:
//   res.render("shop", { user: req.session.user });
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// // POST request for logging in
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   db.users.findByUsername(username, (err, user) => {
//     if (!user) return res.status(403).json({ msg: "No user found!" });
//     if (user.password === password) {
//       req.session.authenticated = true;
//       req.session.user = {
//         username,
//         password,
//       };
//       res.redirect("/shop");
//     } else {
//       res.status(403).json({ msg: "Bad Credentials" });
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });
