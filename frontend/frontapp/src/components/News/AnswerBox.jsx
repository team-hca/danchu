import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
  margin: 30px;
  padding: 10px;
`;

const SentenceBox = styled.div`
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: skyblue;
  box-shadow: 10px 10px 7px rgba(0, 0, 0.5, 0.5);
  text-align: center;
  margin-bottom: 15px;
`;

const AnswerHighlight1 = styled.span`
  background-color: var(--primary);

  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-size: 25px;
`;

const AnswerHighlight2 = styled.span`
  background-color: var(--primary);
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-size: 25px;
`;

const AnswerHighlight3 = styled.span`
  background-color: var(--primary);

  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-size: 25px;
`;

const MainButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 500px;
  &:focus {
    outline: none;
  }

  img {
    width: 80%;
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
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/quiz"); // /quiz로 이동
  };

  const sentence = quizSentence.sentence;
  const countWord = quizSentence.count;
  const indexes = quizSentence.indexes;
  const wordHighlights = [null, words.word1, words.word2, words.word3];

  function StyledWord({ sentence }) {
    if (sentence.includes(indexes[0])) {
      return sentence.split(indexes[0]).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight1 key={idx}>
            &nbsp;{wordHighlights[1]}&nbsp;
          </AnswerHighlight1>,
          part,
        ];
      }, []);
    }
    if (sentence.includes(indexes[1]) && countWord >= 2) {
      return sentence.split(indexes[1]).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight2 key={idx}>
            &nbsp;{wordHighlights[2]}&nbsp;
          </AnswerHighlight2>,
          part,
        ];
      }, []);
    }
    if (sentence.includes(indexes[2]) && countWord >= 3) {
      return sentence.split(indexes[2]).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight3 key={idx}>
            &nbsp;{wordHighlights[3]}&nbsp;
          </AnswerHighlight3>,
          part,
        ];
      }, []);
    }

    return sentence;
  }

  const splitedWords = sentence.split(" ");

  let cnt = 0;

  const splitWords = splitedWords.flatMap((sentence, idx) => {
    cnt += sentence.length;
    if (idx > 1 && (cnt >= 14 || idx % 4 === 0)) {
      cnt = 0;
      return [<StyledWord key={idx} sentence={sentence} />, <br />, <br />];
    }
    return [<StyledWord key={idx} sentence={sentence} />, " "];
  });

  return (
    <Container>
      <SentenceBox>
        <ScrollableContent>
          <span>{splitWords}</span>
        </ScrollableContent>
      </SentenceBox>
      <MainButton onClick={handleButtonClick}>
        <img src={moveToMainPath} alt="moveToMain"></img>
      </MainButton>
    </Container>
  );
}
