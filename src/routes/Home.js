import { useEffect, useState } from "react";
import Books from "../component/Books";
import bookData from "../data/bookData.json";
import { Link } from "react-router-dom";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import LogOut from "../component/LogOut";
const GlobalStyle = createGlobalStyle`
  ul {
    list-style-type: none; /* 리스트 스타일을 없앰 */
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 요소들을 수평 가운데로 정렬 */
  width: 100%;
  font-family: Circular;
  font-size: 14px;
  line-height: 1.43;
  line-break: strict;
  flex-direction: column; /*속성을 설정하여 자식 요소들을 세로 방향으로 배치*/
  align-items: center;
`;
const Header = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  form.search {
    position: relative;
    width: 500px;
  }
  button {
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
  img {
    position: absolute;
    width: 17px;
    top: 10px;
    right: 12px;
    margin: 0;
  }
  .tab-menu {
  }
  > span.logo {
    position: absolute;

    left: 60px;
  }
  > div.isLogIn {
    position: absolute;
    right: 60px;
  }
`;
const LogInSection = styled.div`
  display: flex;
  position: absolute;
  right: 60px;
  span {
    margin: 10px;
  }
`;
const FieldSection = styled.div`
  width: 1800px;
  ul {
    padding-left: 0px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: auto;
  }
  li {
    cursor: pointer;
    margin-right: 110px;
  }
`;
function Home() {
  const bookList = bookData.bookList;
  const [search, setSearch] = useState([]);
  const [user, setUser] = useState(null);
  const [isLogIn, setIsLogIn] = useState(false);
  const [isTabUserMenu, setIsTabUserMenu] = useState(false);
  useEffect(() => {
    axios({
      url: "http://localhost:3001/logIn/success",
      method: "GET",
      withCredentials: true,
    }).then((result) => {
      if (result.data.user) {
        setIsLogIn(true);
        setUser({
          userName: result.data.user.userName,
          id: result.data.user.id,
        });
      }
    });
  }, []);

  const onClick = (event) => {
    // 클릭된 엘리먼트가 li 태그인 경우에만 처리
    setSearch(
      bookList.filter((book) => book.genre.includes(event.target.textContent))
    );
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(
      bookList.filter((book) => book.title.includes(event.target.text.value))
    );
  };

  const tabUserMenu = () => {
    isTabUserMenu ? setIsTabUserMenu(false) : setIsTabUserMenu(true);
  };

  const logOut = () => {};

  console.log(isTabUserMenu);

  return (
    <div>
      <GlobalStyle />
      <Container>
        <div>
          <Header>
            <span className="logo">DN 문고</span>
            <form onSubmit={onSubmit} className="search">
              <input
                type="search"
                name="text"
                required
                className="search-form"
              />
              <button type="submit">
                <img
                  src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
                  alt="버튼"
                />
              </button>
            </form>
            {isLogIn ? (
              <div className="isLogIn">
                <ul>
                  <li className="tab-menu">
                    <button type="button" onClick={tabUserMenu}>
                      {user.userName}님
                    </button>
                  </li>
                  {isTabUserMenu ? (
                    <>
                      <li>마이페이지</li>
                      <li onClick={logOut}>로그아웃</li>
                    </>
                  ) : null}
                </ul>
              </div>
            ) : (
              <div>
                <LogInSection>
                  <Link to={`/logIn/`}>
                    <span>로그인</span>
                  </Link>
                  <Link to={`/adminlogIn/`}>
                    <span>관리자 로그인</span>
                  </Link>
                </LogInSection>
              </div>
            )}
          </Header>
        </div>

        <div>
          <hr />
          <FieldSection>
            <ul>
              <li>
                <h2>분야</h2>
              </li>
              <li
                onClick={() => {
                  setSearch(bookList.slice(0, 0));
                }}
              >
                <h2>종합</h2>
              </li>
              <li onClick={onClick}>
                <h2>소설/시</h2>
              </li>
              <li onClick={onClick}>
                <h2>에세이</h2>
              </li>
              <li onClick={onClick}>
                <h2>예술</h2>
              </li>
              <li onClick={onClick}>
                <h2>종교</h2>
              </li>
              <li onClick={onClick}>
                <h2>사회</h2>
              </li>
              <li onClick={onClick}>
                <h2>과학</h2>
              </li>
              <li onClick={onClick}>
                <h2>경제/경영</h2>
              </li>
              <li onClick={onClick}>
                <h2>만화</h2>
              </li>
              <li onClick={onClick}>
                <h2>잡지</h2>
              </li>
            </ul>
          </FieldSection>
        </div>
        <div>
          <Books searchBook={search} />
        </div>
      </Container>
    </div>
  );
}
export default Home;
