import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import mainBoxImagePath from "../../icon/main_box.png";
import moveToMainPath from "../../icon/move_to_main.png";

const Container = styled.div`
  flex: 1;
  height: auto;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-top: 20px;
`;

const BoxImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  // overflow: hidden;
  position: relative;
  width: 1080px;
  height: 320px;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  width: 70%;
  height: 70%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: pre-line; // 개행이 포함된 문자열을 그대로 표현
`;

const AnswerHighlight1 = styled.span`
  background-color: #ef3c5f;
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerHighlight2 = styled.span`
  background-color: #253846;
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const MainButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 450px;
  &:focus {
    outline: none;
  }

  img {
    transition: transform 0.1s;
  }

  &:hover img {
    transform: scale(1.1);
    opacity: 0.7;
  }

  &:active img {
  }
`;

export default function MainBox() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <Container>
      <BoxImage>
        <img src={mainBoxImagePath} alt="headerBoxImagePath"></img>
        <OverlayText>
          <span>
            <AnswerHighlight1>내가</AnswerHighlight1> 노는 것처럼 보여?
          </span>
          <br />
          <br />
          <span>
            <AnswerHighlight2>때</AnswerHighlight2> 가되면 뭔가를 보여준다고
          </span>
        </OverlayText>
      </BoxImage>

      <MainButton onClick={handleButtonClick}>
        <img src={moveToMainPath} alt="moveToMain"></img>
      </MainButton>
    </Container>
  );
}
