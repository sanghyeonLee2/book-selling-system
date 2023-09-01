import React, { useState, useRef } from "react";
import Cart from "./Cart";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AlignBooks = styled.div`
  padding: 10px;
  margin: 10px;
  width: 1800px;
  position: relative;
  .books {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .book {
    margin-left: 50px;
  }
  #putin-cart-btn {
    cursor: pointer;
    position: absolute;
    left: 1700px;
    bottom: 100px;
    position: fixed;
  }
  .cart {
    box-shadow: 3px 2px 3px 3px gray;
    border-radius: 15px;
    display: none;
    text-align: center;
    right: 500px;
    position: absolute;
    top: 30px;
    background-color: white;
  }
`;
function Books({
  user_num,
  userMileageStamp,
  userMileage,
  searchBook = [],
  showBooks = [],
  setShowUserMileage,
}) {
  const [showCart, setShowCart] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [directOrderBtn, setDirectOrderBtn] = useState(false);
  const navigate = useNavigate();
  const bookRef = useRef();
  const cartOnSubmit = () => {
    let status = true;
    if (isChecked.length === 0) {
      alert("체크된 도서가 없습니다.");
      return;
    }
    axios
      .get("http://localhost:3001/cartCheck", {
        params: { bookNum: isChecked.map((e) => e.num), user_num },
      })
      .then((res) => {
        if (res.status === 200 || res.data.result[0] > 0) {
          alert("이미 책을 장바구니에 담았습니다.");
          console.log(res.data);
          status = false;
          return;
        } else {
          console.log("실패");
        }
      });

    status !== true &&
      axios
        .post("http://localhost:3001/cart", {
          bookNum: isChecked.map((e) => e.num),
          user_num,
        })
        .then((result) => {
          if (result.status === 200) {
            alert("장바구니에 도서가 담겼습니다.");
            console.log("성공");
          } else if (result.status === 400) {
            alert("장바구니에 이미 도서가 존재합니다.");
            return;
          } else {
            console.log("실패");
          }
        });
  };

  const checked = (e, book) => {
    if (e.target.checked === true) {
      setIsChecked([...isChecked, book]);
    } else {
      setIsChecked(isChecked.filter((e) => e.num !== book.num));
    }
  };

  const directOrder = (e) => {
    setDirectOrderBtn(false);
    navigate("/order", {
      state: {
        orderNumState: e.target.previousElementSibling.value,
        params: [directOrderBtn],
        userNum: user_num,
        userMileage,
        userMileageStamp,
      },
    });
  };

  const goCart = (e) => {
    e.target.nextElementSibling.style = "display:inline";
    axios
      .get("http://localhost:3001/cart", { params: { user_num } })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setShowCart(res.data.result.filter((data) => data.num !== null));
        } else {
          console.log("실패");
        }
      })
      .catch((err) => console.log(err));
  };

  const book = (books) => {
    return books.map((book) => (
      <div key={book.num} className="book" ref={bookRef}>
        <input
          type="checkbox"
          onChange={(e) => {
            checked(e, book);
          }}
        />
        <Link
          to={`/book/${book.num}`}
          state={{
            bookNum: book.num,
            bookTitle: book.title,
            bookPrice: book.price,
            userNum: user_num,
            avrgrade: book.aver_grade,
            gradeNum: book.grade_num,
            gradeAcc: book.grade_acc,
          }}
        >
          <h3 className="book-title">{book.title}</h3>
          <img
            src={`/img/${book.title}.png`}
            alt="랜덤짤"
            width="210"
            height="250"
          />
        </Link>
        <p className="book-price">가격 : {book.price}원</p>
        <p>장르 : {book.genre}</p>
        <p className="book-grade">평점 : {book.aver_grade}</p>
        {directOrderBtn.num !== book.num ? (
          <button type="button" onClick={() => setDirectOrderBtn(book)}>
            바로 구매
          </button>
        ) : (
          <>
            <input type="number" placeholder="수량 입력" defaultValue={1} />
            <button type="button" onClick={directOrder}>
              확인
            </button>
            <button type="button" onClick={() => setDirectOrderBtn(false)}>
              취소
            </button>
          </>
        )}
      </div>
    ));
  };
  console.log(directOrderBtn);
  return (
    <>
      <AlignBooks>
        <svg
          onClick={cartOnSubmit}
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-cart-check"
          id="putin-cart-btn"
          viewBox="0 0 16 16"
        >
          <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <div className="books">
          {searchBook.length !== 0 ? book(searchBook) : book(showBooks)}
        </div>
        <>
          <button type="button" onClick={goCart}>
            장바구니
          </button>
          <Cart
            userMileageStamp={userMileageStamp}
            userMileage={userMileage}
            showCartParam={showCart}
            setShowCart={setShowCart}
            user_num={user_num}
          />
        </>
      </AlignBooks>
    </>
  );
}

export default Books;
