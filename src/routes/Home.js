import { useEffect, useState } from "react";
import Books from "../component/Books";
import bookData from "../data/bookData.json";
import { Link } from "react-router-dom";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  ul,li {
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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 13px;
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
    position: absolute;
    left: 70px;
  }

  img {
    position: absolute;
    width: 17px;
    top: 10px;
    right: 12px;
    margin: 0;
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
  const [adminRight, setAdminRight] = useState(false);

  useEffect(() => {
    axios({
      url: "http://localhost:3001/logIn/success",
      method: "GET",
      withCredentials: true,
    }).then((result) => {
      if (result.data.user) {
        setIsLogIn(true);
        setUser({
          adminRight: result.data.user.adminRight,
          userName: result.data.user.userName,
          id: result.data.user.id,
        });
      }
    });
  }, []);

  useEffect(() => {
    axios({
      url: "http://localhost:3001/searchBook",
      method: "GET",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
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

  const logOut = () => {
    //세션 삭제
    axios({
      url: "http://localhost:3001/logOut",
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
    <div>
      <GlobalStyle />
      <Container>
        <div>
          <Header>
            <span className="header-section" id="logo">
              DN 문고
            </span>
            <form onSubmit={onSubmit} className="search header-section">
              <input
                type="search"
                name="text"
                required
                className="search-form"
              />
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
                    <span>{user.userName}님</span>
                    <ul className="dep2">
                      <li>
                        <span>마이페이지</span>
                      </li>
                      <li>
                        <div>
                          <span onClick={logOut}>로그아웃</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <LogInSection>
                  <Link to={`/logIn/`}>
                    <span>로그인</span>
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
