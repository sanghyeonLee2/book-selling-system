import React from "react";
import { styled } from "styled-components";

const GenreSection = styled.div`
  .genre {
    display: flex;
  }

  ul {
    padding-inline-start: 0;
  }
  li {
    cursor: pointer;
    padding: 0 55px;
  }
`;

function GenreList({ setSearch, showBooks = [] }) {
  const onClick = (event) => {
    // 클릭된 엘리먼트가 li 태그인 경우에만 처리
    setSearch(
      showBooks.filter((book) => book.genre.includes(event.target.textContent))
    );
  };
  return (
    <>
      <GenreSection>
        <hr />
        <ul>
          <div className="genre">
            <li>
              <h2>분야</h2>
            </li>
            <li
              onClick={() => {
                setSearch(showBooks.slice(0, 0));
              }}
            >
              <h2> 종합</h2>
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
          </div>
        </ul>
      </GenreSection>
    </>
  );
}

export default GenreList;
