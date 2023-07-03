import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const logIn = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:3001/login",
      method: "POST",
      withCredentials: true, //쿠키나 인증 헤더 정보를 포함시켜 요청하고 싶을때 클라이언트에서 API 요청 메소드를 보낼때 withCredentials 옵션을 true로 설정
      data: {
        id,
        password,
      },
    }).then((result, err) => {
      if (result.status === 200) {
        console.log(result);
        navigate("/");
      } else {
        console.log(err);
        alert("아이디혹은 비밀번호가 잘못되었습니다.");
      }
    });
  };

  return (
    <div>
      <h3>회원 </h3>
      <form onSubmit={logIn}>
        <input
          type="text"
          placeholder="아이디"
          onChange={(e) => setId(e.target.value)}
          required
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
        <button type="submit">로그인</button>
        <br />
        {/* <Checkbox
          control={<Checkbox value="remember" color="primary" />}
          label="로그인 상태 유지"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="아이디 저장" */}
        <br />
        <small>아이디찾기 </small>|<small> 비밀번호찾기 </small>
        <Link to={"signUp/"}>
          |<small> 회원가입</small>
        </Link>
      </form>
      <div>
        <h3>비회원</h3>
        <small>비회원으로 구매 시 입력하신 정보로 로그인해 주세요</small>
        <form>
          <input type="text" placeholder="주문자명" />
          <br />
          <input type="tel" placeholder="휴대폰번호" />
          <br />
          <input type="password" placeholder="주문비밀번호" />
          <button type="submit">로그인</button>
          <br />
          <small>주문비밀번호 찾기</small>| <small> 회원가입 </small>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
