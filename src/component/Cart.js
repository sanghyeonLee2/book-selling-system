import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Cart({
  showCartParam,
  setShowCart,
  user_num,
  userMileage,
  userMileageStamp,
}) {
  //상품 사면 cart삭제
  const cartRef = useRef();
  const [cartInChecked, setCartInChecked] = useState([]);
  const delCart = (book) => {
    axios
      .delete("http://localhost:3001/cartdelete", {
        data: { bookNum: book.num },
      })
      .then((res) => {
        if (res.status === 200) {
          setShowCart(
            showCartParam.filter((delBook) => delBook.num !== book.num)
          );
          console.log("성공");
        } else {
          console.log("실패");
        }
      })
      .catch((err) => console.log(err));
  };
  const cartChecked = (e, book) => {
    e.target.checked
      ? setCartInChecked([...cartInChecked, book])
      : setCartInChecked(cartInChecked.filter((e) => e.num !== book.num));
  };

  const goBack = () => {
    cartRef.current.style = "display : none";
  };

  const quantityChg = (e, cart) => {
    const quantity = Number(e.target.previousSibling.value);
    const price = Number(
      e.target.parentElement.previousSibling.firstElementChild.innerText
    );
    e.target.parentElement.nextSibling.firstElementChild.value =
      price * quantity;
    const quantityObj = {
      cart_num: cart.num,
      quantity,
    };
    axios
      .patch("http://localhost:3001/cartquantity", quantityObj)
      .then((res) => {
        if (res.status === 200) {
          console.log("성공");
        } else {
          console.log("실패");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="cart" ref={cartRef}>
      <p onClick={goBack}>돌아가기</p>
      <h1>장바구니</h1>
      <Link
        to={"/order"}
        state={{
          params: cartInChecked,
          userNum: user_num,
          userMileage,
          userMileageStamp,
        }}
      >
        <h3>주문하기</h3>
      </Link>
      <table border={1}>
        <caption>도서상품</caption>
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" id="checked_all" />
              </label>
              전체선택
            </th>
            <th>상품명</th>
            <th>추가한 날짜</th>
            <th>판매가</th>
            <th>수량</th>
            <th>소계금액</th>
            <th>주문/삭제</th>
          </tr>
        </thead>
        <tbody>
          {showCartParam
            ? showCartParam.map((book) => {
                return (
                  <tr key={book.num}>
                    <td>
                      <input
                        type="checkbox"
                        id="checkbox"
                        onChange={(e) => {
                          cartChecked(e, book);
                        }}
                      />
                    </td>
                    <td>
                      <p>{book.title}</p>
                    </td>
                    <td>{book.date}</td>
                    <td>
                      <p>{book.price}</p>원
                    </td>
                    <td>
                      <>
                        <input type="number" defaultValue={book.quantity} />
                        <input
                          type="button"
                          value="변경"
                          onClick={(e) => quantityChg(e, book)}
                        />
                      </>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="total-price"
                        defaultValue={book.price * book.quantity}
                      />
                    </td>
                    <td>
                      <input
                        type="button"
                        value="삭제"
                        onClick={() => delCart(book)}
                      />
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default Cart;
