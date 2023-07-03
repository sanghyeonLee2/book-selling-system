import React from "react";
import axios from "axios";

function InsertBook() {
  //const [book, setBook] = useState("");
  //const [bookPicture, setBookPicture] = useState("");
  const onSubmitBook = (e) => {
    e.preventDefault();
    const bookInfo = {
      bookTitle: e.target.childNodes[0].value,
      bookPrice: e.target.childNodes[1].value,
      bookPublish: e.target.childNodes[2].value,
      bookWriter: e.target.childNodes[3].value,
    };
    console.log(bookInfo);

    axios
      .post("http://localhost:3001/insertBook", bookInfo)
      .then((res) => {
        if (res.data === false) {
          console.log(res.data);
          alert("이미 책이 있습니다.");
          return;
        } else {
          console.log(res.data);
          alert("책 등록이 완료되었습니다.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={onSubmitBook}>
        <input type="text" name="title" placeholder="책 제목" />
        <input type="text" name="title" placeholder="가격" />
        <input type="text" name="title" placeholder="출판사" />
        <input type="text" name="title" placeholder="작가" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default InsertBook;
