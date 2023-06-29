import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; //useNavigate는 URL주소를 변경할 때 사용하는 Hook
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");

  const register = (e) => {
    e.preventDefault();
    if (pwCheck !== pw) {
      alert("입력된 비밀번호가 다릅니다.");
      return;
    } else {
      const user = { name, id, pw };
      axios
        .post("http://localhost:3001/register", user)
        .then((res) => {
          if (res.data === true) {
            console.log(res.data);
            alert("아이디가 중복되었습니다.");
          } else {
            console.log(res.data);
            alert("회원가입이 완료되었습니다.");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
      setName("");
      setId("");
      setPw("");
    }
  };
  return (
    <div>
      <div>
        <Link to={"/"}>
          <h3>홈</h3>
        </Link>
      </div>
      <div>
        <Link to={"/logIn/"}>
          <h3>로그인</h3>
        </Link>
      </div>
      <div>
        <h3>회원가입</h3>
        <form onSubmit={register}>
          <ul>
            <li id="name">
              이름
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </li>
            <li id="id">
              아이디
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
            <li id="pw">
              비밀번호
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </li>
            <li>
              비밀번호 확인
              <input
                type="password"
                value={pwCheck}
                onChange={(e) => setPwCheck(e.target.value)}
              />
            </li>
            <li>
              <input type="submit" value="가입완료" />
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
