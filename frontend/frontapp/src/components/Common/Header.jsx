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

  @media (max-width: 720px) {
    width: 100w;
    padding: 0 15px;
    margin-bottom: 150px;
  }
`;

const Logo = styled.img`
  width: 250px;
  top: 70px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 720px) {
    width: 50vw;
    padding: 0 15px;
  }
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

  @media (max-width: 720px) {
    // width: 30vw;
    left: 50vw;
    padding: 0 15px;
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
