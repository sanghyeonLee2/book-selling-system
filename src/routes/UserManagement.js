import axios from "axios";
import React, { useEffect, useState } from "react";

function UserManagement() {
  const [userOrder, setUserOrder] = useState([]);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    axios.get("http://localhost:3001/management/order").then((res) => {
      if (res.status === 200) {
        setUserOrder(res.data.result);
      } else {
        console.log("없음");
      }
    });
  }, []);

  const onChangeSelect = (e) => {
    setSelected(e.target.value);
  };
  console.log(selected);

  const udtOrderBtn = (e) => {
    const udtOrderObj = {
      orderNum: e.target.parentElement.parentElement.children[1].innerText,
      selected,
    };
    console.log(udtOrderObj);

    axios
      .patch("http://localhost:3001/management/order", udtOrderObj)
      .then((result) => {
        if (result.status === 200) {
          alert("주문상태가 변경 되었습니다.");
          console.log("성공");
        } else {
          console.log("실패");
        }
      });
  };
  return (
    <div>
      <table border={1}>
        <caption>
          <h2>고객 배송 관리</h2>
        </caption>
        <thead>
          <tr>
            <th>고객 번호</th>
            <th>주문번호</th>
            <th>주문 생성일</th>
            <th>주문 상태</th>
            <th>주문 수량</th>
            <th>사용한 마일리지</th>
          </tr>
        </thead>
        <tbody>
          {userOrder.length !== 0 ? (
            userOrder.map((e) => (
              <tr key={e.num}>
                <td>{e.user_num}</td>
                <td>{e.num}</td>
                <td>{e.createdAt}</td>
                <td>
                  <select
                    defaultValue={e.oreder_status}
                    onChange={onChangeSelect}
                  >
                    <option value="준비중">준비중</option>
                    <option value="배송완료">배송완료</option>
                    <option value="배송중">배송중</option>
                    <option value="배송중">구매확정</option>
                  </select>
                </td>
                <td>{e.total_quantity}</td>
                <td>{e.use_mileage}</td>
                <td>
                  <button type="button" onClick={udtOrderBtn}>
                    수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <p>내역이 없습니다</p>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
