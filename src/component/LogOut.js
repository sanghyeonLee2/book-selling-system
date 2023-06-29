import React from "react";
import axios from "axios";

function LogOut(props) {
  const logOut = () => {
    //세션 삭제
    axios({
      url: "http://localhost:3001/logOut",
      method: "POST",
      withCredentials: true,
    }).then((result) => {
      if (result.status === 200) {
        console.log("성공");
        window.location.reload();
      }
    });
  };
  return (
    <div>
      <button type="button" onClick={logOut}>
        로그아웃
      </button>
    </div>
  );
}

export default LogOut;
