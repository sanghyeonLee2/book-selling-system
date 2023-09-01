const express = require("express");
const bodyParser = require("body-parser");
const userDb = require("./config/userDb.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
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
    saveUninitialized: false, //초기화되지 않은 세션을 저장할 지 여부
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
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true, //쿠키정보 사용하기 위해서
  })
);

app.post("/register", (req, res) => {
  const { name, num, password } = req.body;
  userDb.query(`SELECT * FROM user WHERE num = ${num}`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length > 0) {
      res.json(true);
    } else {
      userDb.query(
        "INSERT INTO user (num, password, user_name) VALUES (?, ?, ?)",
        [num, password, name],
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

app.post("/cart", (req, res) => {
  const { bookNum, user_num } = req.body;
  const sql = "INSERT INTO cart (user_num,book_num) VALUES ?";
  const values = bookNum.map((e) => [user_num, e]);
  userDb.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.post("/cart", (req, res) => {
  const { bookNum, user_num } = req.body;
  console.log(req.body);
  const sql = "INSERT INTO cart (user_num,book_num) VALUES ?";
  const values = bookNum.map((e) => [user_num, e]);
  userDb.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.post("/review", (req, res) => {
  const { content, grade, bookNum, userNum } = req.body;
  userDb.query(
    "INSERT INTO review (content, grade, book_num, user_num) VALUES (?,?,?,?)",
    [content, grade, bookNum, userNum],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.patch("/review/update", (req, res) => {
  const { content, grade, userNum, bookNum } = req.body;
  const udtsql = `UPDATE review SET content = ${content}, grade = ${grade} WHERE book_num = ${bookNum} and user_num = ${userNum}`;
  userDb.query(udtsql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.patch("/cartquantity", (req, res) => {
  const { cart_num, quantity } = req.body;
  const sql = `UPDATE cart SET quantity = ${quantity} WHERE num = ${cart_num}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.patch("/order/isAllReturn", (req, res) => {
  const { orderNum, orderStatus } = req.body;
  const sql = `UPDATE book_order SET order_status = ? WHERE num = ?`;
  userDb.query(sql, [orderStatus, orderNum], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});
app.patch("/book/inventoryUdt", (req, res) => {
  const { bookNum, returnNumArr } = req.body;
  const values = returnNumArr.map((e, idx) => [e, bookNum[idx]]);
  console.log(values, "1");
  const sql = `
  UPDATE book
  SET inventory = inventory + (
    CASE num
      ${values.map(([sub, num]) => `WHEN ${num} THEN ${sub}`).join(" ")}
      ELSE 0
    END
  )
  WHERE num IN (${values.map(([_, num]) => `'${num}'`).join(", ")});
`;

  userDb.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.post("/book/partial", (req, res) => {
  const { orderNum, refundTotal } = req.body;
  console.log(req.body);
  const sql = `INSERT INTO refund (total, book_order_num) VALUES (?,?)`;
  userDb.query(sql, [refundTotal, orderNum], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.post("/return", (req, res) => {
  const { returnReason, returnNum, orderKey } = req.body;
  const values = returnReason.map((elem, idx) => [
    elem,
    returnNum[idx],
    orderKey,
  ]);
  const sql = `INSERT INTO book_return (reason, num, book_order_num) VALUES ?`;
  userDb.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      const insertId = result.insertId;
      res.status(200).json({ insertId });
    }
  });
});

app.patch("/order", (req, res) => {
  const { orderNum } = req.body;
  const sql = `UPDATE book_order SET order_status = '취소' WHERE num = ${orderNum}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.patch("/usermileage/minus", (req, res) => {
  const { userMileage, userMileageStamp, userNum } = req.body;
  const sql = `UPDATE user SET mileage = ${userMileage}, mileage_stamp = ${userMileageStamp} WHERE num = ${userNum}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.patch("/usermileage/plus", (req, res) => {
  const { userMileage, userNum } = req.body;
  const sql = `UPDATE user SET mileage = mileage + ${userMileage} WHERE num = ${userNum}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.delete("/book/delete", (req, res) => {
  const { bookNum } = req.body;
  console.log(bookNum);
  const sql = `delete from book where num = ${bookNum}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.delete("/cartdelete", (req, res) => {
  const { bookNum } = req.body;
  const sql = `delete from cart where num = ${bookNum}`;
  userDb.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

// app.delete("/cart/completeorder", (req, res) => {
//   const { userNum, bookNum } = req.body;
//   const sql = "DELETE FROM cart WHERE (user_num, book_num) IN (?)";

//   const values = bookNum.map((e) => [userNum, e]);

//   userDb.query(sql, [values], (err, result) => {
//     if (err) {
//       console.log(err.message);
//       res.status(500).json({ error: err.message });
//     } else {
//       res.status(200).json({ result });
//     }
//   });
// });

//장바구니 번호 다시 생각해보기
app.post("/login", (req, res) => {
  const { userNum, password } = req.body;
  userDb.query(
    `SELECT * FROM user WHERE num = ${userNum} AND password = ${password}`,
    (err, userInfo) => {
      if (err) {
        console.error(err);
        res.status(500).send("Session save error");
        return;
      }
      if (userInfo.length === 0) {
        res.status(401).send("no data");
        return;
      }
      req.session.save(() => {
        req.session.user = {
          userNum: userInfo[0].num,
          userName: userInfo[0].user_name,
          userMileage: userInfo[0].mileage,
          userMileageStamp: userInfo[0].mileage_stamp,
        };

        res.status(200).json(req.session.user);
      });
    }
  );
});

app.post("/insertBook", (req, res) => {
  const { bookTitle, bookPrice, bookGenre, bookInventory } = req.body;
  userDb.query(
    "INSERT INTO book (title, inventory, price, genre) VALUES (?,?,?,?)",
    [bookTitle, bookInventory, bookPrice, bookGenre],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/review", (req, res) => {
  const { bookNum } = req.query;
  userDb.query(
    `SELECT * FROM review where book_num = ${bookNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});
app.get("/cartCheck", (req, res) => {
  const { bookNum, user_num } = req.query;
  console.log(req.query);
  const sql = `SELECT COUNT(*) AS count 
  FROM cart 
  WHERE user_num = ${user_num} AND book_num IN (${bookNum})`;
  userDb.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.get("/reviewcheck", (req, res) => {
  const { bookNum, userNum } = req.query;
  userDb.query(
    `SELECT COUNT(*) AS count FROM review WHERE book_num = ${bookNum} and user_num = ${userNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/cart", (req, res) => {
  const { user_num } = req.query;
  userDb.query(
    `SELECT * FROM book left outer join cart on (book.num = cart.book_num) WHERE cart.user_num = ${user_num}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/searchbook", (req, res) => {
  userDb.query(`SELECT * FROM book`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
});

app.get("/searchbook", (req, res) => {
  userDb.query(`SELECT * FROM book`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
});

app.patch("/book/update", (req, res) => {
  const { bookTitle, bookGenre, bookPrice, bookInventory, bookNum } = req.body;
  userDb.query(
    `UPDATE book SET title = ${bookTitle},inventory = ${bookInventory},price = ${bookPrice},genre = ${bookGenre} where num = ${bookNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/mileage", (req, res) => {
  const { usedMileage, useContent, userNum } = req.body;
  console.log(req.body);
  userDb.query(
    "INSERT INTO mileage (use_content,used,user_num) VALUES (?,?,?)",
    [useContent, usedMileage, userNum],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/cart/order_list", (req, res) => {
  const { userNum, bookNum, quantity, orderNum } = req.body;
  const values = bookNum.map((e, idx) => [e, quantity[idx], userNum, orderNum]);
  console.log(values);
  userDb.query(
    "INSERT INTO order_list (book_num, indivisual_quantity ,user_num,book_order_num) VALUES ?",
    [values],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/order_list", (req, res) => {
  const { user_num, bookNum } = req.body;
  const values = bookNum.map((e) => [e, user_num]);
  console.log(values);
  userDb.query(
    "INSERT INTO order_list (book_num, user_num) VALUES ?",
    [values],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.patch("/book/grade", (req, res) => {
  const { gradeNum, gradeAcc, avrGrade, bookNum } = req.body;
  userDb.query(
    `UPDATE book SET aver_grade = ${avrGrade},grade_num = ${gradeNum},grade_acc = ${gradeAcc} where num = ${bookNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.patch("/management/order", (req, res) => {
  const { orderNum, selected } = req.body;
  console.log(orderNum, selected);
  userDb.query(
    `UPDATE book_order SET order_status = ? where num = ?`,
    [selected, orderNum],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/order", (req, res) => {
  const { totalPrice, cardKey, userNum, addressKey, totalQuantity } = req.body;
  userDb.query(
    "INSERT INTO book_order (total, card_key, user_num, address_key,total_quantity) VALUES (?,?,?,?,?)",
    [totalPrice, cardKey, userNum, addressKey, totalQuantity],
    (err, result) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      } else {
        const insertId = result.insertId;
        res.status(200).json({ insertId });
      }
    }
  );
});

app.post("/card", (req, res) => {
  const { cardType, cardNum, cardValidate, userNum } = req.body;
  userDb.query(
    "INSERT INTO card (type, number, validate, user_num) VALUES (?,?,?,?)",
    [cardType, cardNum, cardValidate, userNum],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/management/order", (req, res) => {
  userDb.query(`SELECT * FROM book_order`, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

app.get("/order", (req, res) => {
  const userNum = req.query.userNum;
  userDb.query(
    `SELECT *
    FROM book
    LEFT OUTER JOIN order_list ON book.num = order_list.book_num
    inner JOIN book_order ON order_list.book_order_num = book_order.num where book_order.user_num = ${userNum};`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/card", (req, res) => {
  const userNum = req.query.userNum;
  userDb.query(
    `SELECT * FROM card where user_num = ${userNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/address", (req, res) => {
  const { defaultAd, detailAd, postalCode, userNum } = req.body;
  userDb.query(
    "INSERT INTO address (address_default, detail, postal_code,user_num) VALUES (?,?,?,?)",
    [defaultAd, detailAd, postalCode, userNum],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.get("/address", (req, res) => {
  const userNum = req.query.userNum;
  userDb.query(
    `SELECT * FROM address where user_num = ${userNum}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "logOut success" });
  });
});

app.get("/login/success", (req, res) => {
  try {
    const data = req.session;
    res.status(200).json(data);
  } catch (err) {
    res.status(403).json("User not found");
  }
});
