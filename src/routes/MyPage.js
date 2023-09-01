import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import RegisterAddress from "../component/RegisterAddress";
import RegisterCard from "../component/RegisterCard";

const GlobalStyle = createGlobalStyle`
  ul,li {
    list-style-type: none; 
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

function MyPage() {
  const returnReasonRef = useRef();
  const returnNumRef = useRef();
  const location = useLocation();
  const { isLogIn } = location.state;
  const [selectOnChange, setSelectOnChange] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [isChecked, setIsCheck] = useState([]);
  const [isReturnChecked, setIsReturnChecked] = useState([]);

  const returnCheckdFtn = (checkedOrder, e) => {
    e.target.checked
      ? setIsReturnChecked([...isReturnChecked, checkedOrder])
      : setIsReturnChecked(
          isReturnChecked.filter((e) => e.title !== checkedOrder.title)
        );
  };

  const returnBtn = (e) => {
    let returnReasonArr = [];
    let returnNumArr = [];
    let bookNumArr = [];
    let refundTotal = 0;
    let isAllReturn = false;
    let ckdCnt = 0;

    console.log(
      e.target.parentElement.children[0].firstElementChild.firstElementChild
    );

    for (let i = 0; i < e.target.parentElement.children.length - 1; i++) {
      const checked =
        e.target.parentElement.children[i].firstElementChild.firstElementChild
          .firstElementChild.checked;
      if (checked) {
        returnReasonArr.push(
          e.target.parentElement.children[i].firstElementChild.firstElementChild
            .children[1].value
        );
        ckdCnt++;
      }
    }
    if (ckdCnt === e.target.parentElement.children.length - 1) {
      isAllReturn = true;
    }

    for (let i = 0; i < e.target.parentElement.children.length - 1; i++) {
      e.target.parentElement.children[i].firstElementChild.firstElementChild
        .firstElementChild.checked &&
        returnNumArr.push(
          e.target.parentElement.children[i].firstElementChild.firstElementChild
            .children[2].value
        );
    }

    for (let i = 0; i < e.target.parentElement.children.length - 1; i++) {
      console.dir(
        e.target.parentElement.children[i].firstElementChild.children[3]
          .firstElementChild.innerText
      );
      e.target.parentElement.children[i].firstElementChild.firstElementChild
        .firstElementChild.checked &&
        (refundTotal +=
          Number(
            e.target.parentElement.children[i].firstElementChild.children[3]
              .firstElementChild.innerText
          ) *
          Number(
            e.target.parentElement.children[i].firstElementChild
              .firstElementChild.children[2].innerText
          ));
    }

    for (let i = 0; i < e.target.parentElement.children.length - 1; i++) {
      e.target.parentElement.children[i].firstElementChild.firstElementChild
        .firstElementChild.checked &&
        bookNumArr.push(
          e.target.parentElement.children[i].firstElementChild.children[2]
            .innerText
        );
    }

    const returnObj = {
      returnReason: returnReasonArr,
      returnNum: returnNumArr,
      orderKey: isReturnChecked[0].book_order_num,
    };

    const bookInvenUdt = {
      bookNum: bookNumArr,
      returnNumArr,
    };

    axios
      .post("http://localhost:3001/return", returnObj)
      .then((res) => {
        if (res.status === 200) {
          alert("반품이 완료 되었습니다.");
          console.log(res.data.insertId);
          console.log("반품 완료");
          return axios.patch(
            "http://localhost:3001/book/inventoryUdt",
            bookInvenUdt
          );
        } else {
          console.log("반품 실패");
        }
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.result);
          console.log("책 재고량 + 성공");
        } else {
          console.log("책 재고량 +실패");
        }
      });

    isAllReturn
      ? axios
          .patch("http://localhost:3001/order/isAllReturn", {
            orderNum: isReturnChecked[0].book_order_num,
            orderStatus: "전체반품",
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data.result);
              console.log("전체반품 성공");
              return;
            } else {
              console.log("실패");
            }
          })
      : axios
          .patch("http://localhost:3001/order/isAllReturn", {
            orderNum: isReturnChecked[0].book_order_num,
            orderStatus: "일부반품",
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data.result);
              console.log("일부반품 성공");
              return axios.post("http://localhost:3001/book/partial", {
                orderNum: isReturnChecked[0].book_order_num,
                refundTotal,
              });
            } else {
              console.log("실패");
            }
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data.result);
              console.log("전체반품 성공");
              return;
            } else {
              console.log("실패");
            }
          });
  };

  const chkftn = (book, e) => {
    e.target.checked && setIsCheck(book);
  };
  const selectOnChangeFtn = (e) => {
    setSelectOnChange([...selectOnChange, e.target.value]);
  };
  const cancel = () => {
    if (isChecked.order_status === "준비중") {
      axios
        .patch("http://localhost:3001/order", {
          orderNum: isChecked.book_order_num,
        })
        .then((res) => {
          if (res.status === 200) {
            alert("선택한 주문이 취소되었습니다");
            console.log(res.data.result);
            console.log("성공");
          } else {
            console.log("실패");
          }
        });
    } else {
      alert("주문이 이미 발송되어서 취소가 불가능합니다.");
      return;
    }
  };
  //환불 테이블 반품테이블 일대다 관계

  const groupOrdersByNum = (orders) => {
    const groupedOrders = {};
    orders.forEach((order) => {
      if (!groupedOrders[order.num]) {
        groupedOrders[order.num] = [];
      }
      groupedOrders[order.num].push(order);
    });
    return groupedOrders;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/order", {
        params: { userNum: isLogIn.userNum },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.result);
          setDeliveryStatus(res.data.result);
        } else {
          console.log("없음");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isLogIn.userNum]);
  const groupedOrders = groupOrdersByNum(deliveryStatus);

  return (
    <>
      <GlobalStyle />
      <Container>
        <h1>마이페이지</h1>
        <div>
          <ul>
            <li>
              <h3>나의 적립금 스탬프 : {isLogIn.userMileageStamp}</h3>
            </li>
            <li>
              <h3>나의 적립금 : {isLogIn.userMileage}</h3>
            </li>
          </ul>
        </div>
        <div>
          <RegisterAddress userNum={isLogIn.userNum} />
        </div>
        <div>
          <RegisterCard userNum={isLogIn.userNum} />
        </div>
        <h3 className="outer">배송조회</h3>
        {Object.keys(groupedOrders).length !== 0 ? (
          Object.keys(groupedOrders).map((num) => (
            <div key={num}>
              <h4>
                <input
                  type="radio"
                  name="select"
                  onChange={(e) => chkftn(groupedOrders[num][0], e)}
                />
                주문번호: {num} | 생성일:
                {groupedOrders[num][0].createdAt} | 주문총액
                {groupedOrders[num][0].total}원 | 주문상태:
                {groupedOrders[num][0].order_status} | 총 수량:
                {groupedOrders[num][0].total_quantity}
              </h4>
              <fieldset>
                {groupedOrders[num].map((status, index) => (
                  <div key={index}>
                    <ul>
                      {groupedOrders[num][0].order_status === "배송완료" && (
                        <div>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              returnCheckdFtn(groupedOrders[num][index], e)
                            }
                          />
                          <select
                            onChange={(e) => selectOnChangeFtn(e)}
                            ref={returnReasonRef}
                          >
                            <option>도서불량</option>
                            <option>고객변심</option>
                          </select>
                          환불 수량:
                          <select ref={returnNumRef}>
                            {new Array(
                              groupedOrders[num][index].indivisual_quantity
                            )
                              .fill(null)
                              .map((_, idx) => (
                                <option key={idx}>{idx + 1}</option>
                              ))}
                          </select>
                        </div>
                      )}
                      <li>책 제목: {status.title}</li>
                      <li>{status.book_num}</li>
                      <li>
                        책 가격:<span> {status.price}</span>
                      </li>
                      <li>책 장르: {status.genre}</li>
                      <li>수량: {status.indivisual_quantity}</li>
                      {/* 필요한 주문 상세 정보 항목들 추가 */}
                    </ul>
                  </div>
                ))}
                <>
                  {groupedOrders[num][0].order_status === "배송완료" && (
                    <button type="button" onClick={returnBtn}>
                      반품
                    </button>
                  )}
                </>
              </fieldset>
            </div>
          ))
        ) : (
          <p>주문 목록이 없습니다</p>
        )}
        <button type="button" onClick={cancel}>
          주문취소
        </button>
      </Container>
    </>
  );
}

export default MyPage;
