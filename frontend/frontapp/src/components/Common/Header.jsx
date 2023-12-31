import React from "react";
import styled from "styled-components";
import danchuPath from "../../icon/danchu.png";
// import questionMarkPath from "../../icon/question_mark_circle_icon.png";
import QuestionMarkModal from "../../icon/QuestionMark";

const Container = styled.div`
  flex: 1;
  width: 720px;
  // max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-top: 0px;
  margin-bottom: 200px;
`;

const Logo = styled.img`
  width: 250px;
  top: 70px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const QuestionMark = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 50px;
  position: absolute;
  right: 350px;
  top: 50px;
  transform: translateY(-50%);
  transform: translateX(320px);
  &:focus {
    outline: none;
  }

  img {
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &:active img {
    opacity: 0.7;
  }
`;

export default function Header() {
  return (
    <Container>
      <Logo src={danchuPath} alt="Logo"></Logo>
      <QuestionMark>
        <QuestionMarkModal />
      </QuestionMark>
    </Container>
  );
}
