import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
import Cart from "./routes/Cart";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/SignUp";

//axios모듈에서 axios함수를 불러온다. ($ajax랑 거의 같다)
//쓰는 이유는 서버에 대이터를 요청할 떄 비동기적으로 하기 위해
//함수형 컴포넌트

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logIn/" element={<LogIn />} />
          <Route path="/logIn/signUp/" element={<SignUp />} />
          <Route path="/book/:id" element={<Detail />} />
          <Route path="/book/cart/" element={<Cart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
