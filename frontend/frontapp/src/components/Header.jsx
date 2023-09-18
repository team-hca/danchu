import React from "react";
import styled from "styled-components";
import danchuPath from "../icon/danchu.png";
import questionMarkPath from "../icon/question_mark_circle_icon.png";

const Container = styled.div`
  flex: 1;
  width: 720px;
  // max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-bottom: 250px;
`;

const Logo = styled.img`
  width: 250px;
  top: 70px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const QuestionMark = styled.img`
  width: 50px;
  position: absolute;
  right: 10px;
  top: 50px;
  transform: translateY(-50%);
`;

export default function Header() {
  return (
    <Container>
      <Logo src={danchuPath} alt="Logo"></Logo>
      <QuestionMark src={questionMarkPath} alt="QuestionMark"></QuestionMark>
    </Container>
  );
}
