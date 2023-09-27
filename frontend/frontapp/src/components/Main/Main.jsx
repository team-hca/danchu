import React from "react";
import styled from "styled-components";
import MainBox from "./MainBox";
import MainMessage from "./MainMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 720px;
  margin-bottom: 100px;
`;

export default function Main({ quizInfo, active, words }) {
  console.log("quizInfo : ", quizInfo);
  console.log("active : ", active);
  return (
    <Container>
      <MainMessage />
      <MainBox quizInfo={quizInfo} active={active} words={words} />
    </Container>
  );
}
