import axios from "axios";
import React from "react";

function RegisterAddress({ userNum }) {
  const registerAd = (e) => {
    e.preventDefault();
    const address = {
      defaultAd: e.target.children[0].value,
      detailAd: e.target.children[2].value,
      postalCode: e.target.children[4].value,
      userNum,
    };
    axios.post("http://localhost:3001/address", address).then((res) => {
      if (res.status === 200) {
        alert("주소 등록이 완료 되었습니다.");
        console.log("주소 등록 성공");
      } else {
        console.log("주소 등록 실패");
      }
    });
  };
  return (
    <div>
      <fieldset>
        <legend>배송지 등록</legend>
        <form onSubmit={registerAd}>
          기본주소
          <input type="text" />
          <br />
          상세주소
          <input type="text" />
          <br />
          우편번호
          <input type="text" />
          <br />
          <button type="submit">등록</button>
        </form>
      </fieldset>
    </div>
  );
}

export default RegisterAddress;
