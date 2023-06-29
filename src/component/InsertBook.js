import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function InsertBook() {
  const navigate = useNavigate();
  const [bookTitle, setBookTitle] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookPublish, setBookPublish] = useState("");
  const [bookWriter, setBookWriter] = useState("");
  //const [bookPicture, setBookPicture] = useState("");
  const onSubmitBook = (e) => {
    e.preventDefault();
    const book = {
      bookTitle,
      bookPrice,
      bookPublish,
      bookWriter,
    };
    axios
      .post("http://localhost:3001/insertBook", book)
      .then((res) => {
        if (res.data === false) {
          console.log(res.data);
          alert("이미 책이 있습니다.");
        } else {
          console.log(res.data);
          alert("책 등록이 완료되었습니다.");
          navigate("/books", { state: { book } });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={onSubmitBook}>
        <input
          type="text"
          name="title"
          placeholder="책 제목"
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="text"
          name="title"
          placeholder="가격"
          onChange={(e) => setBookPrice(e.target.value)}
        />
        <input
          type="text"
          name="title"
          placeholder="출판사"
          onChange={(e) => setBookPublish(e.target.value)}
        />
        <input
          type="text"
          name="title"
          placeholder="작가"
          onChange={(e) => setBookWriter(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

export default InsertBook;
