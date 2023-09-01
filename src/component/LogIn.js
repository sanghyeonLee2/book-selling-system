import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function LogIn({ logInAlert, setIsLogIn }) {
  const back = () => {
    logInAlert.current.style = "display: none";
  };
  const [userNum, setUserNum] = useState("");
  const [password, setPassword] = useState("");

  const logIn = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:3001/login",
      method: "POST",
      withCredentials: true, //쿠키나 인증 헤더 정보를 포함시켜 요청하고 싶을때 클라이언트에서 API 요청 메소드를 보낼때 withCredentials 옵션을 true로 설정
      data: {
        userNum,
        password,
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setIsLogIn(res.data);
        logInAlert.current.style = "display: none";
      }
    });
  };

  return (
    <>
      <h4 className="go-back" onClick={back}>
        뒤로가기
      </h4>
      <fieldset>
        <legend>
          <h3>회원 </h3>
        </legend>
        <form onSubmit={logIn}>
          <input
            type="text"
            placeholder="사용자 번호"
            onChange={(e) => setUserNum(e.target.value)}
            required
            autoComplete="on"
            autoFocus
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호"
            required
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <br />
          <button type="submit">로그인</button>
          <br />
          <small>아이디찾기 </small>|<small> 비밀번호찾기 </small>
          <Link to={"signUp/"}>
            |<small> 회원가입</small>
          </Link>
        </form>
      </fieldset>
    </>
  );
}

export default LogIn;
