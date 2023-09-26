import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  margin: 30px;
  padding: 10px;
`;

const SenteceBox = styled.div`
  border: none;
  border-radius: 5px;
  width: 100%;
  background-color: skyblue;
  box-shadow: 10px 10px 7px rgba(0, 0, 0.5, 0.5);
  text-align: center;
  `

const AnswerHighlight1 = styled.span`
  background-color: ${(props) => (props.active ? "var(--primary)" : "var(--secondary)")};
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerHighlight2 = styled.span`
  background-color: ${(props) => (props.active ? "var(--primary)" : "var(--secondary)")};
  color: white;
  padding: 2px 20px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const AnswerHighlight3 = styled.span`
  background-color: ${(props) => (props.active ? "var(--primary)" : "var(--secondary)")};
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
  
  const handleButtonClick = () => {
    navigate("/quiz"); // /quiz로 이동
  };

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  },[]);

  const data = props.sentence;
  const sentence = data.sentence;
  const countWord = data.count;

  const word1 = data.indexes[0];
  const word2 = data.indexes[1];
  const word3 = data.indexes[2];
  
  const {active} = props;

  function StyledWord({sentence}) {

    if (sentence.includes(word1)) {
      return sentence.split(word1).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight1 active={active === 0} key={idx}>&nbsp;&nbsp;1&nbsp;&nbsp;</AnswerHighlight1>,
          part,
        ];
      }, []);
    
    }
    if (sentence.includes(word2) && countWord >= 2) {
      return sentence.split(word2).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight2 active={active === 1} key={idx}>&nbsp;&nbsp;2&nbsp;&nbsp;</AnswerHighlight2>,
          part,
        ];
      }, []);
    }
    if (sentence.includes(word3) && countWord >= 3) {
      return sentence.split(word3).reduce((acc, part, idx) => {
        if (idx === 0) return [...acc, part];
        return [
          ...acc,
          <AnswerHighlight3 active={active === 2} key={idx}>&nbsp;&nbsp;3&nbsp;&nbsp;</AnswerHighlight3>,
          part,
        ];
      }, []);
    }

    return sentence;
  }

  const words = sentence.split(" ");
  
  let cnt = 0;
  
  const splitWords = words.flatMap((sentence, idx) => {
    cnt += sentence.length;
    if (idx > 1 && (cnt >= 14 || idx % 4 === 0)) {
      cnt = 0;
      return [<StyledWord key={idx} sentence={sentence} active = {active.toString()} />, <br/>, <br/>];
    }
    return [<StyledWord key={idx} sentence={sentence} active = {active.toString()} />,' '];
  });

  return (
    <Container>
      {/* <BoxImage>
        <img src={mainBoxImagePath} alt="headerBoxImagePath"></img>
        <OverlayText>
          <ScrollableContent>
            <span>{splitWords}</span>
          </ScrollableContent>
        </OverlayText>
      </BoxImage> */}
        <SenteceBox>
          <ScrollableContent>
            <span>{splitWords}</span>
          </ScrollableContent>
          </SenteceBox>
      {location.pathname==="/quiz"?null:
      <MainButton onClick={handleButtonClick}>
        <img src={moveToMainPath} alt="moveToMain"></img>
      </MainButton>}
    </Container>
  );
}