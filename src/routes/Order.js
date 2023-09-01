import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const OrderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const GlobalStyle = createGlobalStyle`
  ul,li {
    list-style-type: none; 
  }
`;
function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookData = location.state.params;
  const { orderNumState } = location.state;
  const { userMileageStamp, userMileage, userNum } = location.state;
  const [userAd, setUserAd] = useState([]);
  const [userCard, setUserCard] = useState([]);
  const [chkAd, setChkAd] = useState([]);
  const [chkCd, setChkCd] = useState([]);
  const [isUseMileage, setIsUseMileage] = useState(false);

  const totalPrice = () => {
    let price = bookData.reduce((acc, cur) => {
      return acc + cur.price * (cur.quantity || orderNumState || 1);
    }, 0);
    return price;
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/address", { params: { userNum } })
      .then((res) => {
        if (res.status === 200) {
          setUserAd(res.data.result);
        } else {
          console.log("없음");
        }
      });
  }, [userNum]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/card", { params: { userNum } })
      .then((res) => {
        if (res.status === 200) {
          setUserCard(res.data.result);
        } else {
          console.log("없음");
        }
      });
  }, [userNum]);

  const chkAdFtn = (e, ad) => {
    if (e.target.checked === true) {
      setChkAd([ad]);
    }
  };

  const chkCdFtn = (e, cd) => {
    if (e.target.checked === true) {
      setChkCd([cd]);
    }
  };

  const useTotalMileage = (e) => {
    e.target.previousElementSibling.value =
      e.target.previousElementSibling.previousElementSibling.value;
    e.target.previousElementSibling.previousElementSibling.value = 0;
  };

  const userMileageOk = (e) => {
    const useAbleMileage =
      e.target.previousElementSibling.previousElementSibling.value;
    if (
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling.value < 10
    ) {
      alert("적립금 스탬프가 10개 미만입니다.");
      return;
    }
    if (useAbleMileage % 1000 !== 0) {
      alert("적립금 사용액은 1000원단위로 사용이 가능합니다.");
      return;
    }
    e.target.nextElementSibling.nextElementSibling.firstElementChild.value =
      totalPrice() - useAbleMileage;
    e.target.parentElement.children[12].firstElementChild.value = Math.round(
      (totalPrice() - useAbleMileage) / 10
    );
    setIsUseMileage(true);
  };

  const noUseMileage = (e) => {
    e.target.parentElement.children[6].value = userMileage;
    e.target.parentElement.children[7].value = 0;
    setIsUseMileage(true);
  };

  const orderSubmit = (e) => {
    e.preventDefault();
    if (chkAd.length === 0 || chkCd.length === 0) {
      alert("카드 또는 배송지를 등록해 주세요");
      return;
    }
    if (!isUseMileage) {
      alert("적립금 사용 여부를 선택해주세요");
      return;
    }
    const order = {
      totalPrice: totalPrice(),
      cardKey: chkCd[0].key,
      userNum,
      addressKey: chkAd[0].key,
      totalQuantity: bookData.reduce((acc, cur, idx) => {
        return acc + (cur.quantity || orderNumState[idx] || 1);
      }, 0),
    };

    let maileage = {
      usedMileage: e.target.children[7].value,
      useContent: "주문",
      userNum,
    };

    const userMileageObj = {
      userMileage: userMileage - e.target.children[7].value,
      userMileageStamp: userMileageStamp - 10,
      userNum,
    };

    const orderListObj = {
      userNum,
      bookNum: bookData.map((e) => e.book_num || e.num),
      quantity: bookData.map((e, idx) => e.quantity || orderNumState[idx]),
    };

    const conf = window.confirm("주문 하시겠습니까?");

    if (conf) {
      axios
        .post("http://localhost:3001/order", order)
        .then((res) => {
          if (res.status === 200) {
            orderListObj.orderNum = res.data.insertId;
            console.log("주문 등록 성공");
            return axios.post(
              "http://localhost:3001/cart/order_list",
              orderListObj
            );
          }
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("주문목록 등록 성공");
            alert("주문이 완료되었습니다.");
            navigate("/");
            // return axios.delete("http://localhost:3001/cart/completeorder", {
            //   data: {
            //     userNum,
            //     bookNum: bookData.map((e) => e.book_num || e.num),
            //   },
          } else {
            console.log("주문목록 등록 실패");
          }
        });
      // .then((res) => {
      //   console.log(res);
      //   if (res === 200) {
      //     console.log(res);
      //     console.log("카트 삭제 성공");
      //
      //   } else {
      //     console.log("카트 삭제 실패");
      //   }
      // });
      if (Number(e.target.children[7].value) !== 0) {
        maileage.usedMileage = 0 - Number(e.target.children[7].value);
        axios
          .post("http://localhost:3001/mileage", maileage)
          .then((res) => {
            if (res.status === 200) {
              console.log("적립금 - 완료");
              return axios.patch(
                "http://localhost:3001/usermileage/minus",
                userMileageObj
              );
            } else {
              console.log("적립금 - 실패");
            }
          })
          .then((res) => {
            if (res.status === 200) {
              console.log("고객 적립금 변경 성공");
            } else {
              console.log("고객 적립금 변경 실패");
            }
          });
      } else {
        console.dir();
        userMileageObj.userMileage = e.target.children[6].value;
        axios
          .post("http://localhost:3001/mileage", maileage)
          .then((res) => {
            if (res.status === 200) {
              console.log("적립금 + 완료");
              return axios.patch(
                "http://localhost:3001/usermileage/plus",
                userMileageObj
              );
            } else {
              console.log("적립금 + 실패");
            }
          })
          .then((res) => {
            if (res.status === 200) {
              console.log("고객 적립금 변경 성공");
            } else {
              console.log("고객 적립금 변경 실패");
            }
          });
      }
    }
  };
  //적립금 부분 보완 필요
  return (
    <>
      <GlobalStyle />
      <OrderContainer>
        <fieldset>
          <legend>
            <h3>주문하기</h3>
          </legend>
          <form onSubmit={orderSubmit}>
            <>
              <h3>주문 상품</h3>
              {bookData.length !== 0 ? (
                bookData.map((book) => (
                  <div key={book.num}>
                    <fieldset>
                      <ul>
                        <li>제목 : {book.title}</li>
                        <li>수량 : {book.quantity || orderNumState || 1}</li>
                        <li>
                          가격 :
                          {book.price * (book.quantity || orderNumState || 1)}원
                        </li>
                      </ul>
                    </fieldset>
                  </div>
                ))
              ) : (
                <p>주소가 없습니다</p>
              )}
            </>
            <div>
              <h3>주소 선택</h3>
              {userAd.length !== 0 ? (
                userAd.map((ad) => (
                  <div key={ad.key}>
                    <fieldset>
                      <ul>
                        <li>
                          <input
                            type="radio"
                            name="ad"
                            onChange={(e) => chkAdFtn(e, ad)}
                          />
                          배송지 기본주소 : {ad.address_default}
                        </li>
                        <li>배송지 상세주소 : {ad.detail}</li>
                        <li>배송지 우편번호 : {ad.postal_code}</li>
                      </ul>
                    </fieldset>
                  </div>
                ))
              ) : (
                <p>주소가 없습니다</p>
              )}
            </div>
            <div>
              <h3>카드 선택</h3>
              {userCard.length !== 0 ? (
                userCard.map((cd) => (
                  <div key={cd.key}>
                    <fieldset>
                      <ul>
                        <li>
                          <input
                            type="radio"
                            name="cd"
                            onChange={(e) => chkCdFtn(e, cd)}
                          />
                          신용카드 종류 : {cd.type}
                        </li>
                        <li>신용카드 번호 : {cd.number}</li>
                        <li>신용카드 유효기간 : {cd.validate}</li>
                      </ul>
                    </fieldset>
                  </div>
                ))
              ) : (
                <p>카드가 없습니다</p>
              )}
            </div>
            적립금 스탬프 :
            <input type="text" defaultValue={userMileageStamp} />개 적립금
            사용가능 액 :
            <input type="text" defaultValue={userMileage} />원 적립금 사용
            <input type="text" defaultValue={0} />
            <button type="button" onClick={useTotalMileage}>
              전액
            </button>
            <button type="button" onClick={userMileageOk}>
              사용
            </button>
            <button type="button" onClick={noUseMileage}>
              사용안함
            </button>
            <h3>
              주문 총액 :
              <input type="text" defaultValue={totalPrice()} />원
            </h3>
            <h3>
              적립 예정 금액 :
              <input type="text" defaultValue={Math.round(totalPrice() / 10)} />
              원
            </h3>
            <button type="submit">주문</button>
          </form>
        </fieldset>
      </OrderContainer>
    </>
  );
}

export default Order;
