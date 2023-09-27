import axios from "axios";
import { React, useEffect, useState } from "react";
import styled from "styled-components";
import Footer from "../components/Common/Footer";
import Header from "../components/Common/Header";
import Main from "../components/Main/Main";
import News from "../components/News/News";
import Error from "./Error";

const Container = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  // overflow-y: auto;
  align-items: center;
  justify-content: center;
`;
let today = new Date();

function getWordsFromLocalStorage() {
  const guess = JSON.parse(localStorage.getItem("guess"));
  const guessOne = JSON.parse(localStorage.getItem("guessOne"));
  const guessTwo = JSON.parse(localStorage.getItem("guessTwo"));

  return {
    word1: guess && guess[0] && guess[0][0] ? guess[0][0].word : null,
    word2:
      guessOne && guessOne[0] && guessOne[0][0] ? guessOne[0][0].word : null,
    word3:
      guessTwo && guessTwo[0] && guessTwo[0][0] ? guessTwo[0][0].word : null,
  };
}
const winState = JSON.parse(localStorage.getItem("winState"));

const ErrorComponent = () => {
  return <Error />;
};

export default function QuizResult() {
  // QuizResult props로 sentence 받는 걸로 수정해야 함
  const [quizInfo, setQuizInfo] = useState();
  useEffect(() => {
    axios
      .get(
        `api/v1/quiz/today?date=${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
      )
      .then((response) => {
        setQuizInfo(response.data);
      });
  }, []);

  // 로컬에서 정답 가져오기
  const words = getWordsFromLocalStorage();

  return (
    <>
      {winState === -1 ? (
        <ErrorComponent />
      ) : (
        <Container>
          <Header />
          {quizInfo !== undefined && words !== undefined && (
            <Main quizInfo={quizInfo} words={words} />
          )}
          <News words={words} />)
        </Container>
      )}
      <Footer />
    </>
  );
}
