const mysql = require("mysql");
const userDb = mysql.createPool({
  // Pool이 만들어짐 -> connection에 여러개 생성됨
  host: "localhost",
  user: "root",
  password: "178446",
  database: "book_store",
  port: 3306,
});

module.exports = userDb;
