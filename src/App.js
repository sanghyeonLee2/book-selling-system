import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./routes/SignUp";
import Order from "./routes/Order";
import MyPage from "./routes/MyPage";
import BookDetail from "./routes/BookDetail";
import UserManagement from "./routes/UserManagement";
import Header from "./component/Header";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createGlobalStyle, styled } from "styled-components";
import GenreList from "./component/GenreList";
import Books from "./component/Books";
import BookManagement from "./routes/BookManagement";

const GlobalStyle = createGlobalStyle`
  ul,li {
    list-style-type: none; 
  }

  @font-face {
    font-family: 'KBO-Dia-Gothic_bold';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
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

//axios모듈에서 axios함수를 불러온다. ($ajax랑 거의 같다)
//쓰는 이유는 서버에 대이터를 요청할 떄 비동기적으로 하기 위해
//함수형 컴포넌트

function App() {
  const [search, setSearch] = useState([]);

  const [showBooks, setShowBooks] = useState();

  const [isLogIn, setIsLogIn] = useState(false);

  const logInAlert = useRef();

  useEffect(() => {
    axios({
      url: "http://localhost:3001/login/success",
      method: "GET",
      withCredentials: true,
    }).then((res) => {
      if (res.data.user) {
        setIsLogIn({
          userNum: res.data.user.userNum,
          userName: res.data.user.userName,
          userMileage: res.data.user.userMileage,
          userMileageStamp: res.data.user.userMileageStamp,
        });
      } else if (res.status === 403) {
        setIsLogIn(false);
      }
    });
  }, []);

  useEffect(() => {
    axios({
      url: "http://localhost:3001/searchbook",
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        setShowBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(
      showBooks.filter((book) => book.title.includes(event.target.text.value))
    );
  };
  return (
    <div className="App">
      <GlobalStyle />
      <Router>
        <Header
          onSubmit={onSubmit}
          isLogIn={isLogIn}
          setIsLogIn={setIsLogIn}
          logInAlert={logInAlert}
        />
        <Container>
          <GenreList setSearch={setSearch} showBooks={showBooks} />
          <Routes>
            <Route
              path="/"
              element={
                <Books
                  user_num={isLogIn.userNum}
                  userMileageStamp={isLogIn.userMileageStamp}
                  userMileage={isLogIn.userMileage}
                  searchBook={search}
                  showBooks={showBooks}
                />
              }
            />
            <Route path="/book/:bookNumber" element={<BookDetail />} />
            <Route path="/management/:userNum" element={<UserManagement />} />
            <Route
              path="/managment/book_insert"
              element={<BookManagement showBooks={showBooks} />}
            />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
