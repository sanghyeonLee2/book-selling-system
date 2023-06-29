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
      url: "http://localhost:3001/adminLogin",
      method: "POST",
      withCredentials: true,
      data: {
        id: id,
        pw: password,
      },
    }).then((result, err) => {
      if (result.status === 200) {
        navigate("/");
      } else {
        console.log(err);
        alert("아이디혹은 비밀번호가 잘못되었습니다.");
      }
    });
  };

  return (
    <div>
      <h1>관리자 로그인</h1>
      <form onSubmit={logIn}>
        <input
          margin="normal"
          label="아이디"
          type="text"
          placeholder="아이디"
          onChange={(e) => setId(e.target.value)}
          required
          autoFocus
        />
        <br />
        <input
          margin="normal"
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          required
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">로그인</button>
        <br />
        {/* <FormControlLabel
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
    </div>
  );
}

export default LogIn;
