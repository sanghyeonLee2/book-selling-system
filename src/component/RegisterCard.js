import axios from "axios";
import React from "react";

function RegisterCard({ userNum }) {
  const registerCard = (e) => {
    e.preventDefault();
    const address = {
      cardType: e.target.children[0].value,
      cardNum: e.target.children[2].value,
      cardValidate: e.target.children[4].value,
      userNum,
    };
    console.log(address);
    axios.post("http://localhost:3001/card", address).then((res) => {
      if (res.status === 200) {
        alert("카드 등록이 완료 되었습니다.");
        console.log("카드 등록 성공");
      } else {
        console.log("카드 등록 실패");
      }
    });
  };
  return (
    <div>
      <fieldset>
        <legend>카드 등록</legend>
        <form onSubmit={registerCard}>
          신용카드 종류
          <input type="text" />
          <br />
          신용카드 번호
          <input type="text" />
          <br />
          신용카드 유효기간
          <input type="text" />
          <br />
          <button type="submit">등록</button>
        </form>
        <></>
      </fieldset>
    </div>
  );
}

export default RegisterCard;
