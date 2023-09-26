import React from "react";
import styled from "styled-components";
import AnswerBox from "./AnswerBox";
import AnswerMessage from "./AnswerMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 720px;
  margin-bottom: 100px;
`;

export default function Answer({ quizSentence, words }) {
  console.log("Answer에서 찍는 quizSentence : ", quizSentence);
  console.log("Answer에서 찍는 words : ", words);
  return (
    <Container>
      <AnswerMessage />
      <AnswerBox quizSentence={quizSentence} words={words} />
    </Container>
  );
}
