import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function BookDetail() {
  const reviewTextRef = useRef();
  const gradeRef = useRef();
  const location = useLocation();
  const [review, setReview] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const {
    bookTitle,
    bookPrice,
    userNum,
    bookNum,
    avrgrade,
    gradeNum,
    gradeAcc,
  } = location.state;

  useEffect(() => {
    axios
      .get("http://localhost:3001/review", { params: { bookNum } })
      .then((res) => {
        if (res.status === 200) {
          setReview(res.data.result);
        } else {
          console.log("없음");
        }
      });
  }, []);
  //평점 누적값 속성을 넣어야?

  const reviewUpdate = (e) => {
    const grade =
      e.target.previousElementSibling.previousElementSibling.firstElementChild
        .value;
    const content = e.target.previousElementSibling.value;
    const updateReviewObj = {
      content,
      grade,
      userNum,
      bookNum,
    };

    setUpdateMode(false);

    axios
      .patch("http://localhost:3001/review/update", updateReviewObj)
      .then((result) => {
        if (result.status === 200) {
          console.log("성공");
          return axios.get("http://localhost:3001/review", {
            params: { bookNum },
          });
        } else {
          console.log("실패");
        }
      })
      .then((res) => {
        if (res.status === 200) {
          alert("리뷰가 수정되었습니다.");
          setReview(res.data.result);
        } else {
          console.log("없음");
        }
      });
  };

  const registerReview = (e) => {
    e.preventDefault();
    const reviewObj = {
      content: e.target.children[1].value,
      grade: e.target.firstElementChild.firstElementChild.value,
      bookNum,
      userNum,
    };

    const bookGradeObj = {
      gradeNum: gradeNum + 1,
      gradeAcc:
        gradeAcc + Number(e.target.firstElementChild.firstElementChild.value),
      avrGrade:
        (gradeAcc +
          Number(e.target.firstElementChild.firstElementChild.value)) /
        (gradeNum + 1),
      bookNum,
    };

    axios
      .get("http://localhost:3001/reviewcheck", {
        params: { bookNum, userNum },
      })
      .then((res) => {
        if (res.status === 200 && res.data.result[0].count > 0) {
          alert("이미 이 책에 리뷰를 작성 하였습니다.");
          console.log("중복");
          return;
        } else if (res.status === 200 && res.data.result[0].count === 0) {
          console.log("리뷰 조회 성공");
          return axios.post("http://localhost:3001/review", reviewObj);
        } else {
          console.log("리뷰 조회 실패");
          return;
        }
      })
      .then((res) => {
        if (res && res.status === 200) {
          console.log(res);
          console.log("리뷰 작성 성공");
          return axios.patch("http://localhost:3001/book/grade", bookGradeObj);
        } else {
          console.log("리뷰 실패");
        }
      })
      .then((res) => {
        if (res && res.status === 200) {
          console.log(res);
          alert("리뷰가 작성되었습니다.");
          console.log("책 테이블 평점 삽입 성공");
        } else {
          console.log("책 테이블 평점 삽입실패");
        }
      });

    // 책 평점 수정 시 책 테이블의 책 평균 평점이 수정되야 하는 부분 로직 작성 필요 => DB 트리거?
  };
  return (
    <div>
      <>
        <h3 className="book-title">{bookTitle}</h3>
        <p className="book-price">가격 : {bookPrice}원</p>
        <img
          src={`/img/${bookTitle}.png`}
          alt="랜덤짤"
          width="210"
          height="250"
        />
      </>
      <div>
        <div>
          <form onSubmit={registerReview}>
            <div>
              평점:
              <input type="number" ref={gradeRef} />
            </div>
            <textarea
              placeholder="내용을 10자 이상 입력해 주세요. 주제와 무관한 댓글, 악플, 배송문의 등의 글은 임의 삭제될 수 있습니다."
              maxLength="3000"
            />
            <button type="submit">등록</button>
          </form>
          {review.length === 0 ? (
            <p>리뷰가 없습니다</p>
          ) : (
            review.map((con) => {
              return (
                <div key={con.key}>
                  <span>고객 번호: {con.user_num}</span>
                  <span>작성 일자: {con.date}</span>
                  <div>
                    평점: <span ref={gradeRef}>{con.grade}</span>
                  </div>
                  <div>
                    댓글 내용 <span ref={reviewTextRef}>{con.content}</span>
                    {con.user_num === userNum ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setUpdateMode(true)}
                        >
                          수정
                        </button>
                        <div>
                          {updateMode && (
                            <div>
                              <div>
                                평점:
                                <input
                                  type="number"
                                  defaultValue={gradeRef.current.innerText}
                                />
                              </div>
                              <textarea
                                defaultValue={reviewTextRef.current.innerText}
                              />
                              <button type="button" onClick={reviewUpdate}>
                                수정완료
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
