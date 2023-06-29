import { useState } from "react";
import { useLocation } from "react-router-dom";
function Cart() {
  const [showBooksInCart, setShowBooksInCart] = useState(useLocation().state);
  const delCart = (books) => {
    console.log(showBooksInCart.filter((book) => book.id !== books.id));
    setShowBooksInCart(showBooksInCart.filter((book) => book.id !== books.id));
  };

  return (
    <div>
      <h1>장바구니</h1>
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
            <th>판매가</th>
            <th>수량</th>
            <th>소계금액</th>
            <th>주문/삭제</th>
          </tr>
        </thead>
        <tbody>
          {showBooksInCart.map((book) => {
            return (
              <tr key={book.id}>
                <td>
                  <input
                    type="checkbox"
                    id="checkbox"
                    //onChange={(e) => checkedEach(e, book)}
                  />
                </td>
                <td>
                  <p>{book.title}</p>
                </td>
                <td>
                  <p>{book.price}원</p>
                </td>
                <td>
                  <label>
                    <input type="text" defaultValue={book.num} />
                    <input
                      type="button"
                      value="변경"
                      onClick={(e) => {
                        e.target
                          .closest("tr")
                          .querySelector("#price").textContent =
                          book.price *
                          parseInt(e.target.previousElementSibling.value);
                      }}
                    />
                  </label>
                </td>
                <td>
                  <p id="price">{book.price * book.num}원</p>
                </td>
                <td>
                  <input
                    type="button"
                    value="주문"
                    // onClick={() => orderCart(book)}
                  />
                  <input
                    type="button"
                    value="삭제"
                    onClick={() => delCart(book)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Cart;
