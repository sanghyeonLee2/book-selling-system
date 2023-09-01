import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LogIn from "./LogIn";

const HeaderLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 5px 5px 10px;
  margin: 10px;
  form.search {
    position: relative;
    width: 500px;
  }
  .menu-wrap {
    position: relative;
  }
  .menu-wrap .dep1 {
    position: absolute;
    left: 500px;
    top: -35px;
  }
  .menu-wrap .dep1 > li {
    display: inline-block;
    vertical-align: top;
    width: 100px;
    backgraound: #ddd;
    text-align: center;
  }

  .menu-wrap .dep1 > li > span {
    background: black;
    color: white;
    cursor: pointer;
    display: block;
    padding: 10px;
    border: 1px solid;
    box-shadow: 1px gray;
    border-radius: 21px;
  }
  .menu-wrap .dep2 {
    padding: 0px;
    background: white;
    box-shadow: 1px gray;
    border: 1px solid;
    border-radius: 8px;
    display: none;
  }
  .menu-wrap .dep2 span {
    cursor: pointer;
    padding: 10px 0;
    display: block;
    text-align: center;
  }
  .menu-wrap .dep1 > li:hover > span {
    box-shadow: 2px 2px 2px 1px gray;
  }
  .menu-wrap .dep1 > li:hover > .dep2 {
    display: block;
  }
  .menu-wrap .dep2 span:hover {
    text-decoration: underline;
  }

  #noneImg {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  input.search-form {
    width: 100%;
    border: 1px solid #bbb;
    border-radius: 8px;
    padding: 10px 12px;
  }

  #logo {
    font-family: "KBO-Dia-Gothic_bold";
    cursor: pointer;
    position: absolute;
    left: 90px;
    top: 18px;
    color: #353b48;
  }

  img {
    position: absolute;
    width: 17px;
    top: 10px;
    right: 12px;
    margin: 0;
  }

  .login-button {
    position: absolute;
    cursor: pointer;
    right: 100px;
  }

  .go-back {
    cursor: pointer;
  }

  .login-section {
    box-shadow: 3px 2px 3px 3px gray;
    border-radius: 21px;
    display: none;
    text-align: center;
    width: 450px;
    height: 700px;
    position: absolute;
    z-index: 1;
    top: 200px;
    background-color: white;
  }
`;
function Header({ onSubmit, isLogIn = [], setIsLogIn, logInAlert }) {
  const logInButton = () => {
    logInAlert.current.style = "display : inline";
  };

  const logOut = () => {
    //세션 삭제
    axios({
      url: "http://localhost:3001/logout",
      method: "POST",
      withCredentials: true,
    }).then((result) => {
      if (result.status === 200) {
        console.log("성공");
        setIsLogIn(false);
      }
    });
  };

  return (
    <HeaderLayout>
      <Link to={"/"}>
        <h1 id="logo">DN 문고</h1>
      </Link>
      <form onSubmit={onSubmit} className="search">
        <input type="search" name="text" required className="search-form" />
        <button type="submit" id="noneImg" className="header-section">
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
            alt="버튼"
          />
        </button>
      </form>
      {isLogIn ? (
        <div className="menu-wrap">
          <ul className="dep1">
            <li>
              <span>{isLogIn.userName}님</span>
              <ul className="dep2">
                <li>
                  <Link to={"/mypage"} state={{ isLogIn }}>
                    <span>마이페이지</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/management/${isLogIn.userNum}`}>
                    고객 배송 관리
                  </Link>
                </li>
                <li>
                  <Link to={"/managment/book_insert"}>도서 관리 페이지</Link>
                </li>
                <li>
                  <span onClick={logOut}>로그아웃</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ) : (
        <>
          <span className="login-button" onClick={logInButton}>
            로그인
          </span>
          <div className="login-section" ref={logInAlert}>
            <LogIn
              logInAlert={logInAlert}
              setIsLogIn={setIsLogIn}
              isLogIn={isLogIn}
            />
          </div>
        </>
      )}
    </HeaderLayout>
  );
}

export default Header;
