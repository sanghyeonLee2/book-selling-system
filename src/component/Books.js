import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import InsertBook from "./InsertBook";
import styled from "styled-components";

const AlignBooks = styled.div`
  display: flex;
  padding: 10px;
  margin: 10px;
  width: 1800px;
  flex-wrap: wrap;
  > div.book {
    flex-basis: 280px; /* Adjust the width as needed */
    width: 100%;
    margin: 10px;
  }
`;
function Books({ searchBook = [], showBooks = [] }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showInsertBook, setShowInsertBook] = useState(false);
  //useEffect사용

  const cartOnClick = () => {
    console.log(cart);
  };
  const checked = (e, book) => {
    if (e.target.checked === true) {
      book.num += 1;
      setCart([...cart, book]);
    } else {
      book.num -= 1;
      setCart(cart.filter((uncheckedBook) => uncheckedBook.id !== book.id));
    }
  };
  return (
    <div>
      <button type="button" onClick={cartOnClick}>
        장바구니 담기
      </button>
      <AlignBooks>
        {searchBook.length !== 0
          ? searchBook.map((book) => (
              <div key={book.num} className="book">
                {console.log(book)}
                <h3>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      console.log(e.target);
                    }}
                  />
                  <Link to={`/book/${book.num}`}>{book.title}</Link>
                </h3>
                <p>가격 : {book.price}원</p>
                <p>출판사 : {book.publish}</p>
                <p>작가 : {book.writer}</p>
                <p>평점 : {book.rating}</p>
              </div>
            ))
          : showBooks.map((book) => (
              <div key={book.num} className="book">
                <h3>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      checked(e, book);
                    }}
                  />
                  <Link to={`/book/${book.num}`}>{book.title}</Link>
                </h3>
                <img
                  id="hz"
                  src="https://source.unsplash.com/random"
                  alt="랜덤짤"
                  width="210
                  "
                  height="250"
                ></img>
                <p>가격 : {book.price}원</p>
                <p>출판사 : {book.publish}</p>
                <p>작가 : {book.writer}</p>
                <p>평점 : {book.rating}</p>
              </div>
            ))}
      </AlignBooks>
      <>
        <h3
          onClick={() => {
            navigate(`/book/cart/`, { state: cart });
          }}
        >
          장바구니
        </h3>
      </>
      <>
        <h3 onClick={() => setShowInsertBook(true)}>책 추가하기</h3>
        {showInsertBook && <InsertBook />}
      </>
    </div>
  );
}

export default Books;
