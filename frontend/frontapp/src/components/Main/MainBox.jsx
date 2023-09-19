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
  margin-bottom: 80px;
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
  height: 90%;
  width: 680px;
  display: flex;
  justify-content: center;
  white-space: pre-line;
  overflow: auto;

  // 스크롤 바 스타일
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ScrollableContent = styled.div`
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 100%;
  overflow-y: auto;
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
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

  const word1 = "내가";
  const word2 = "때";

  function StyledWord({ word }) {
    if (word.includes(word1)) {
      return word.split(word1).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight1 key={idx}>{word1}</AnswerHighlight1>,
          part,
        ];
      }, []);
    }
    if (word.includes(word2)) {
      return word.split(word2).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight2 key={idx}>{word2}</AnswerHighlight2>,
          part,
        ];
      }, []);
    }
    return word;
  }

  const words =
    word1 + " 노는 것 처럼 보여?\n\n\n" + word2 + "가 되면 뭔가를 보여준다고";

  const splitWords = words.split(/(\s+|\n+)/).flatMap((word, idx) => {
    if (word === "\n") {
      return [<br key={idx} />];
    }
    return <StyledWord key={idx} word={word} />;
  });

  return (
    <Container>
      <BoxImage>
        <img src={mainBoxImagePath} alt="headerBoxImagePath"></img>
        <OverlayText>
          <ScrollableContent>
            <span>{splitWords}</span>
          </ScrollableContent>
        </OverlayText>
      </BoxImage>

      <MainButton onClick={handleButtonClick}>
        <img src={moveToMainPath} alt="moveToMain"></img>
      </MainButton>
    </Container>
  );
}
