const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const db = require("./db");
const PORT = process.env.PORT || 4001;
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: true, sameSite: "none" },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

app.get("/login", (req, res) => {
  res.render("login");
});

// POST request for logging in
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.users.findByUsername(username, (err, user) => {
    if (!user) return res.status(403).json({ msg: "No user found!" });
    if (user.password === password) {
      // Add your authenticated property below:
      req.session.authenticated = true;
      // Add the user object below:
      req.session.user= {
        username,
        password,
      }
      // Log the session below:
      console.log(req.session);
      res.redirect("/shop");
    } else {
      res.status(403).json({ msg: "Bad Credentials" });
    }
  });
});

app.get("/shop", (req, res) => {
  res.render("shop", { user: 'Guest' });
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
//Storing Session Data
//In memory (this is the default storage)
//In a database like MongoDB or MySQL
//In a file system like Redis or Memcached
