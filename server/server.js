const express = require("express");
const bodyParser = require("body-parser");
const userDb = require("./config/userDb.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const dotenv = require("dotenv");
// const userDB = require("./userDb");
const FileStore = require("session-file-store")(session);
// dotenv.config();
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(
  session({
    secret: "secret",
    resave: false, //세션을 항상 저장할 지 여부 지정
    store: new FileStore(),
    saveUninitialized: true, //초기화되지 않은 세션을 저장할 지 여부
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: false,
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true, //쿠키정보 사용하기 위해서
  })
);

app.post("/register", (req, res) => {
  const { name, id, password } = req.body;
  userDb.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length > 0) {
      res.json(true);
    } else {
      userDb.query(
        "INSERT INTO users (name, id, pw) VALUES (?, ?, ?)",
        [name, id, password],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            res.send("User registered successfully!");
          }
        }
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}`);
});

app.post("/login", (req, res) => {
  const { id, password } = req.body;
  userDb.query(
    `SELECT * FROM users WHERE id = ${id} AND pw = ${password}`,
    (err, userInfo) => {
      if (err) {
        console.error(err);
        res.status(500).send("Session save error");
        return;
      }
      req.session.save(() => {
        req.session.user = {
          userId: userInfo[0].id,
          userName: userInfo[0].name,
        };
        const data = req.session;
        console.log(data);
        res.status(200).json({ data });
      });
    }
  );
});

app.post("/insertBook", (req, res) => {
  const { bookTitle, bookPrice, bookPublish, bookWriter } = req.body;
  console.log(req.body);
  userDb.query(
    `SELECT * FROM book WHERE title = ${bookTitle} AND writer = ${bookWriter}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (result.length > 0) {
        res.json(false);
      } else {
        userDb.query(
          "INSERT INTO book (title, price, writer, publish) VALUES (?, ?, ?, ?)",
          [bookTitle, bookPrice, bookWriter, bookPublish],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
              res.send("Book registered successfully!");
            }
          }
        );
      }
    }
  );
});

app.get("/searchBook", (req, res) => {
  userDb.query(`SELECT * FROM book`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
});

app.post("/logOut", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "logOut success" });
  });
});

app.get("/logIn/success", (req, res) => {
  try {
    const data = req.session;
    res.status(200).json(data);
  } catch (err) {
    res.status(403).json("User not found");
  }
});
