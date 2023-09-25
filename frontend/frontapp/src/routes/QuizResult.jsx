import axios from "axios";
import { React, useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../components/Common/Footer";
import Header from "../components/Common/Header";
import Answer from "../components/News/Answer";
import News from "../components/News/News";

const Container = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  // overflow-y: auto;
  align-items: center;
  justify-content: center;
`;
let today = new Date();

// 로컬스토리지에 word배열 저장하는 함수 - 테스트 데이터
function saveWordsToLocalStorage(data) {
  const formattedData = {
    word1: data.word1,
    word2: data.word2 || null,
    word3: data.word3 || null,
  };
  localStorage.setItem("words", JSON.stringify(formattedData));
}

function getWordsFromLocalStorage() {
  const savedData = localStorage.getItem("words");
  return savedData
    ? JSON.parse(savedData)
    : { word1: null, word2: null, word3: null };
}

export default function QuizResult() {
  // QuizResult props로 sentence 받는 걸로 수정해야 함
  const [quizSentence, setQuizSentence] = useState();
  useEffect(() => {
    console.log("찍는다~");
    axios
      .get(
        `/api/v1/quiz/today?date=${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
      )
      .then((response) => {
        setQuizSentence(response.data);
        console.log("QuizReulst에서 찍는 response.data : ", response.data);
      });
  }, []);

  // 로컬에 저장 테스트
  const wordsArray = { word1: "과자", word2: "아이스크림", word3: null };
  saveWordsToLocalStorage(wordsArray);

  // 로컬에서 words 가져오기
  const words = getWordsFromLocalStorage();

  return (
    <>
      {/* <Navbar /> */}
      <Container>
        <Header />
        <Answer quizSentence={quizSentence} />

        <News words={words} />
      </Container>
      <Footer />
    </>
  );
}
