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
  overflow-y: hidden;
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
`;

const DummyItem = styled.div`
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: left;
  height: auto;
  display: inline;
`;

const AnswerHighlight1 = styled.span`
  background-color: #ef3c5f;
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerHighlight2 = styled.span`
  background-color: #253846;
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerHighlight3 = styled.span`
  background-color: #253846;
  color: white;
  padding: 2px 20px;
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

export default function AnswerBox({ quizSentence, words }) {
  console.log("AnswerBox에서 찍은 quizSentence : ", quizSentence);
  console.log("AnswerBox에서 찍은 words : ", words);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/quiz"); // /quiz로 이동
  };

  const sentence = quizSentence.sentence;
  const countWord = quizSentence.count;
  const indexes = quizSentence.indexes;
  const wordHighlights = [null, words.word1, words.word2, words.word3];

  console.log("sentence : ", sentence);
  console.log("countWord : ", countWord);
  console.log("indexes : ", indexes);
  console.log("words : ", words);

  // ^1, ^2, ^3을 AnswerHighlight로 감싸주는 함수
  function wrapWithHighlight(text) {
    const parts = text.split(/(\^\d)/); // '^숫자' 패턴으로 문자열 분리

    return parts.map((part, idx) => {
      if (part.startsWith("^")) {
        let i = parseInt(part[1]);

        switch (i) {
          case 1:
            return (
              <AnswerHighlight1 key={`highlight-${idx}`}>
                {wordHighlights[i]}
              </AnswerHighlight1>
            );
          case 2:
            return (
              <AnswerHighlight2 key={`highlight-${idx}`}>
                {wordHighlights[i]}
              </AnswerHighlight2>
            );
          case 3:
            return (
              <AnswerHighlight3 key={`highlight-${idx}`}>
                {wordHighlights[i]}
              </AnswerHighlight3>
            );
          default:
            return part;
        }
      } else {
        return part;
      }
    });
  }

  return (
    <Container>
      <BoxImage>
        <img src={mainBoxImagePath} alt="headerBoxImagePath"></img>
        <OverlayText>
          <ScrollableContent>
            <DummyItem>
              {sentence ? wrapWithHighlight(sentence) : "Loading..."}
            </DummyItem>
          </ScrollableContent>
        </OverlayText>
      </BoxImage>
      <MainButton onClick={handleButtonClick}>
        <img src={moveToMainPath} alt="moveToMain"></img>
      </MainButton>
    </Container>
  );
}
