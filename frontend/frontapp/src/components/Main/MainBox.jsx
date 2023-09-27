import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  border: 1px solid var(--gray-1000);
  border-radius: 5px;
  width: 100%;
  background-color: Ghostwhite;
  word-break: keep-all;
  line-height: 60px;
  box-shadow: 10px 10px 7px rgba(0, 0, 0.5, 0.5);
  text-align: center;
`;

const AnswerHighlight = styled.span`
  background-color: ${(props) =>
    props.active ? "var(--primary)" : "var(--secondary)"};
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

export default function MainBox(props) {
  const navigate = useNavigate();
  const { quizInfo, active, words } = props;

  const handleButtonClick = () => {
    navigate("/quiz"); // /quiz로 이동
  };

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  const sentence = quizInfo.sentence;
  const countWord = quizInfo.count;
  const indexes = quizInfo.indexes;
  const spaces = active !== undefined ? "\u00A0\u00A0\u00A0" : "\u00A0";
  const guesses = ["guess", "guessOne", "guessTwo"];

  let wordHighlights = [];
  if (words !== undefined) {
    wordHighlights = [words.word1, words.word2, words.word3];
  }

  function StyledWord({ sentence }) {
    for (let i = 0; i < countWord; i++) {
      if (sentence.includes(indexes[i])) {
        return sentence.split(indexes[i]).reduce((acc, part, idx) => {
          if (idx === 0) return [...acc, part];
          let content =
            active !== undefined
              ? localStorage.getItem(guesses[i]) !== null &&
                JSON.parse(localStorage.getItem(guesses[i]))[0] !== null
                ? JSON.parse(localStorage.getItem(guesses[i]))[0][0]
                    .similarity === 100
                  ? JSON.parse(localStorage.getItem(guesses[i]))[0][0].word
                  : `${i + 1}`
                : `${i + 1}`
              : wordHighlights[i];
          return [
            ...acc,
            <AnswerHighlight key={idx} active={active === i}>
              {spaces}
              {content}
              {spaces}
            </AnswerHighlight>,
            part,
          ];
        }, []);
      }
    }
    return sentence;
  }

  const splitedWords = sentence.split(/(\s+)/).flatMap((sentencePart, idx) => {
    return [<StyledWord key={idx} sentence={sentencePart} />];
  });

  return (
    <Container>
      <SentenceBox>
        <ScrollableContent>
          <span>{splitedWords}</span>
        </ScrollableContent>
      </SentenceBox>
      {location.pathname === "/quiz" ? null : (
        <MainButton onClick={handleButtonClick}>
          <img src={moveToMainPath} alt="moveToMain"></img>
        </MainButton>
      )}
    </Container>
  );
}
