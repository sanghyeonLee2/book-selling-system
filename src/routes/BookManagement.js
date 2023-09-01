import React from "react";
import axios from "axios";

function BookManagement({ showBooks = [] }) {
  const delBookInfo = (e) => {
    const bookNum = e.target.parentElement.parentElement.children[0].innerText;
    console.log(bookNum);
    axios
      .delete("http://localhost:3001/book/delete", {
        data: { bookNum },
      })
      .then((res) => {
        if (res.status === 200) {
          alert("도서가 삭제 되었습니다.");
          // setShowCart(
          //   showCartParam.filter((delBook) => delBook.num !== book.num)
          // );
          console.log("성공");
        } else {
          console.log("실패");
        }
      })
      .catch(
        (err) => console.log(err),
        alert("고객 장바구니에 책이 담겨져 있습니다")
      );
  };

  const udtBookInfo = (e) => {
    const udtbookObj = {
      bookTitle:
        e.target.parentElement.parentElement.children[1].firstElementChild
          .value,
      bookGenre:
        e.target.parentElement.parentElement.children[2].firstElementChild
          .value,
      bookPrice:
        e.target.parentElement.parentElement.children[3].firstElementChild
          .value,
      bookInventory:
        e.target.parentElement.parentElement.children[4].firstElementChild
          .value,
      bookNum: e.target.parentElement.parentElement.children[0].innerText,
    };
    axios.patch("http://localhost:3001/book/update", udtbookObj).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log(res.data);
        alert("수정이 완료되었습니다.");
      } else {
        console.log("수정 실패");
      }
    });
  };

  const onSubmitBook = (e) => {
    e.preventDefault();
    const bookInfo = {
      bookTitle: e.target.children[0].value,
      bookPrice: e.target.children[1].value,
      bookGenre: e.target.children[2].value,
      bookInventory: e.target.children[3].value,
    };
    axios
      .post("http://localhost:3001/insertBook", bookInfo)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log(res.data);
          alert("책 등록이 완료되었습니다.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <table border={1}>
        <caption>
          <h2>도서 관리 페이지</h2>
        </caption>
        <thead>
          <tr>
            <th>도서 번호</th>
            <th>도서 제목</th>
            <th>도서 장르</th>
            <th>도서 가격</th>
            <th>남은 수량</th>
            <th>평균 평점</th>
            <th>평점 수</th>
          </tr>
        </thead>
        <tbody>
          {showBooks.length !== 0 ? (
            showBooks.map((e) => (
              <tr key={e.num}>
                <td>{e.num}</td>
                <td>
                  <input type="text" defaultValue={e.title} />
                </td>
                <td>
                  <input type="text" defaultValue={e.genre} />
                </td>
                <td>
                  <input type="number" defaultValue={e.price} />
                </td>
                <td>
                  <input type="number" defaultValue={e.inventory} />
                </td>
                <td>{e.aver_grade}</td>
                <td>{e.grade_num}</td>
                <td>
                  <button type="button" onClick={udtBookInfo}>
                    수정
                  </button>
                  <button type="button" onClick={delBookInfo}>
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <td>내역이 없습니다</td>
          )}
        </tbody>
      </table>
      <div>
        <form onSubmit={onSubmitBook}>
          <input type="text" placeholder="책 제목" />
          <input type="text" placeholder="가격" />
          <input type="text" placeholder="분야" />
          <input type="text" placeholder="재고량" />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

export default BookManagement;
