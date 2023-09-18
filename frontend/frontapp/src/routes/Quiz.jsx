import React from "react";
import styled from "styled-components";
import { useState } from "react";
import H1 from "../components/H1";
import H2 from "../components/H2";
import Text from "../components/Text";
import Button from "../components/Button";
import QuestionMark from "../icon/QuestionMark";
import Icon from "../components/Icon";
import H4 from "../components/H4";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
`;

const LeftContainer = styled.div`
color: var(--white);
  width: 100%;
  height: 100%;
  background: #9498F2;

  // padding: 18px;
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
`;

// const ButtonStyle = styled.div`

// width: 40px;
// height: 40px;

// `

const QuizContainer = styled.div`
  color: var(--white);
  padding: 18px;
  margin: 18px;
  border-radius: 8px;
  border: 1px solid var(--primary);
  background: var(--background);
  // background: #9498F2;
  width:80%;
  height:100%;
  justify-content:center;
`;

const LogoContainer = styled.div`
color: white;
  margin-bottom: 18px;
`

const QuizSentenceContainer = styled.div`
  // height: 100%;
  padding: 18px;
  color: var(--white);
  text-align: center;
`;

const ButtonStyle = styled.div`
  // justify-content: center;
  width: 80%;
`

const RightContainer = styled.div`
  width: 100%;
  height: 100%;
  background: blue;
`;

export default function Quiz() {
  return (
    <Container>
      <LeftContainer>
        
          <LogoContainer> 
            <H1 >DanChu</H1>
          </LogoContainer>
          <QuizContainer>
        
          <H4>2023년 09월 13일의 단추를 끼워보세요!</H4>
     
          <Icon inSize={"24px"} outSize={"36px"} color="#6F19FF"
            >
            <QuestionMark/>
          </Icon>
          <QuizSentenceContainer>
            <H2>100억에 팔린 강남 아파트…</H2>
            <H2>집들이 직접 가봤더니 '깜짝'</H2>
          </QuizSentenceContainer>
          <ButtonStyle>
          <Button>포기하기</Button></ButtonStyle>
        </QuizContainer>
      </LeftContainer>
      <RightContainer>b</RightContainer>
    </Container>
  );
}
