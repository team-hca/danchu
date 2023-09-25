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

export default function Answer(quizSentence) {
  console.log("QuizResult에서 받은 quizSentence : ", quizSentence);
  return (
    <Container>
      <AnswerMessage />
      <AnswerBox sentence={quizSentence.quizSentence} />
    </Container>
  );
}
