import React, { useState, useEffect } from "react";
import styled from "styled-components";
import H1 from "../components/H1";
import H2 from "../components/H2";
import Button from "../components/Button";
import QuestionMark from "../icon/QuestionMark";
import { Tabs, Tab, Content } from "../components/Tabs";
import axios from "axios";
import H3 from "../components/H3";
import SubmitButton from "../components/SubmitButton";

const onClickGiveUp = (message = null, onConfirm, onCancel) => {
  if (!onConfirm || typeof onConfirm !== "function") {
    return;
  }
  if (onCancel && typeof onCancel !== "function") {
    return;
  }

  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };

  return confirmAction;
};

const giveUpConfirm = () => alert("포기했습니다.");
const cancelConfirm = () => alert("취소했습니다.");
const confirmGiveUp = onClickGiveUp(
  // todo 포기 로직 작성
  "포기하면 '오늘의 단추'가 모두 포기상태가 됩니다. 그래도 포기하시겠습니까?",
  giveUpConfirm,
  cancelConfirm
);

const Container = styled.div`
  width: 100vw;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const QuestionMarkContainer = styled.div`
  margin-right: 60px;
  margin-top: 60px;
  place-self: flex-end;
`;

const CenterContainer = styled.div`
  // background-color: var(--primary);
  // border: 1px solid var(--primary);
  width: 720px;
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-bottom: 300px;
`;

const LogoContainer = styled.div`
  padding: 60px;
`;

const DateDanchuContentContainer = styled.div`
  padding: 16px;
`;

const H6Styled = styled.h6`
  display: inline-block;
  color: ${(props) => props.color};
`;

const QuizContainer = styled.div`
  background-color: var(--white);
  max-width: 720px;
  padding: 60px;
  border-radius: 5px;
  margin-bottom: 60px;
`;

const QuizSentenceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const QuizSentenceAnswerContainer = styled.div`
  // display: flex;
  // flex-direction: column;
`;

const TabContainer = styled.div`
  // width: 720px;
  width: 100%;
  text-align: center;
`;

const ContentContainer = styled.div`
  text-align: -webkit-center;
  // width: 720px;
  width: 100%;
  background-color: var(--primary);
  border-radius: 0px 0px 18px 18px;
  // box-shadow: 5px 5px 5px;
`;

const GiveUpContainer = styled.div`
  // justify-content: right;
  // float: right;
  width: 100%;
`;

const GiveUpButtonContainer = styled.div`
  float: right;
  // width: 100%;
  width: 300px;
  margin-bottom: 40px;
  margin-right: -20px;
`;

const Answer = styled.div`
  background-color: ${(props) => props.color};
  height: 50px;
  width: 50%;
  text-align: center;
`;

const TextContainer = styled.div`
  margin: 40px 40px 40px 40px;

  display: flex;
  justify-content: space-between;
`;

const TableContainer = styled.div`
  background-color: white;
  opacity: 50%;
  // height: 50px;
  margin: 40px;
  padding: 15px;
`;

const Table = styled.table`
  text-align: left;
`;

const Thead = styled.thead`
  text-align: left;
`;

const ThNumber = styled.th`
  padding: 15px;
  width: 70px;
  max-width: 70px;
  min-width: 70px;
  font-weight: 1000;
`;

const ThGuess = styled.th`
  padding: 15px;
  width: 140px;
  max-width: 140px;
  min-width: 140px;
  font-weight: 1000;
`;
const ThPercent = styled.th`
  padding: 15px;
  width: 100px;
  max-width: 100px;
  min-width: 100px;
  font-weight: 1000;
`;

const ThRank = styled.th`
  padding: 15px;
  width: 280px;
  max-width: 280px;
  min-width: 280px;
  font-weight: 1000;
`;
const TdNumber = styled.th`
  padding: 15px;
  width: 70px;
  max-width: 70px;
  min-width: 70px;
`;

const TdGuess = styled.th`
  padding: 15px;
  width: 140px;
  max-width: 140px;
  min-width: 140px;
`;
const TdPercent = styled.th`
  padding: 15px;
  width: 100px;
  max-width: 100px;
  min-width: 100px;
`;

const TdRank = styled.th`
  padding: 15px;
  width: 280px;
  max-width: 280px;
  min-width: 280px;
`;

const InputStyle = styled.input`
  font-size: var(--mobile-text);
  color: ${(props) => props.color};
  weight: 300;
  word-break: break-all;
  width: 70%;
  height: 50px;
  border-radius: 18px;
  padding-left: 20px;
`;

export default function Quiz() {
  const [active, setActive] = useState(0);
  const [quizSentence, setQuizSentence] = useState();
  const [quizCount, setQuizCount] = useState();
  const [guesses, setGuesses] = useState();
  const [inputValue, setInputValue] = useState();
  const [inputValueOne, setInputValueOne] = useState();
  const [inputValueTwo, setInputValueTwo] = useState();
  let today = new Date();

  const saveLocalStorage = () => {
    if (
      inputValue &&
      !JSON.parse(localStorage.getItem("guess")).includes(inputValue)
    ) {
      if (localStorage.getItem("guess")) {
        console.log(
          "localStorage.guesses: " + JSON.parse(localStorage.getItem("guess"))
        );
        let arr = JSON.parse(localStorage.getItem("guess"));
        arr.push(inputValue);
        localStorage.setItem("guess", JSON.stringify(arr));
        setGuesses(JSON.parse(localStorage.getItem("guess")));
      } else {
        var array = [];

        localStorage.setItem("guess", JSON.stringify(array));
      }
    }
  };

  const onSubmitOne = () => {
    recordStartTime();

    if (
      inputValueOne &&
      !JSON.parse(localStorage.getItem("guessOne")).includes(inputValueOne)
    ) {
      if (localStorage.getItem("guessOne")) {
        console.log(
          "localStorage.guessOne: " + JSON.parse(localStorage.getItem("guessOne"))
        );
        let arr = JSON.parse(localStorage.getItem("guessOne"));
        arr.push(inputValueOne);
        localStorage.setItem("guessOne", JSON.stringify(arr));
        setGuesses(JSON.parse(localStorage.getItem("guessOne")));
      } else {
        var array = [];

        localStorage.setItem("guessOne", JSON.stringify(array));
      }
    };
  }

  const onSubmitTwo = () => {
    recordStartTime();

    if (
      inputValueTwo &&
      !JSON.parse(localStorage.getItem("guessTwo")).includes(inputValueTwo)
    ) {
      if (localStorage.getItem("guessTwo")) {
        console.log(
          "localStorage.guessTwo: " + JSON.parse(localStorage.getItem("guessTwo"))
        );
        let arr = JSON.parse(localStorage.getItem("guessTwo"));
        arr.push(inputValueTwo);
        localStorage.setItem("guessTwo", JSON.stringify(arr));
        setGuesses(JSON.parse(localStorage.getItem("guessTwo")));
      } else {
        var array = [];

        localStorage.setItem("guessTwo", JSON.stringify(array));
      }
    };
  };

  const recordStartTime = () => {
    if (localStorage.getItem("startTime")) {
      console.log(localStorage.getItem("startTime"));
    } else {
      localStorage.setItem("startTime", Date.now());
    };
  };

  const onSubmit = () => {
    recordStartTime();

    saveLocalStorage();

  };

  const handleClick = (e) => {
    const index = parseInt(e.target.id, 0);
    if (index !== active) {
      setActive(index);
    }
  };
  const handleQuiz = () => {
    axios
      .get(
        `http://localhost:8080/api/v1/quiz/today?date=${today.getFullYear()}-${(
          today.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-21`
      )
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        // console.log(JSON.stringify(response.data).sentence[0]);
        // console.log(JSON.stringify(response.data.sentence));
        // console.log("sentence: "+response.data.sentence);
        // console.log("sentence[0]: "+response.data.sentence[1]);

        const sentence = response.data.sentence;
        console.log(sentence);
        setQuizSentence(sentence);
        console.log("quizSentence: " + quizSentence);
        setQuizCount(response.data.count);
        console.log("quizcount: " + quizCount);
        if (!localStorage.getItem("date")) {
          localStorage.setItem(
            "date",
            `${today.getFullYear()}-${(today.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-21`
          );
        }
        if (!localStorage.getItem("winState")) {
          localStorage.setItem("winState", -1);
        }
      })
      .catch((error) => {
        console.error("today quiz request failed: ", error);
      });
  };

  useEffect(() => {
    console.log("today: " + today);
    console.log("today.getMonth" + today.getMonth());
    handleQuiz();
    if (localStorage.getItem("guess")) {
      setGuesses(localStorage.getItem("guess"));
      console.log("guess: " + guesses);
    }
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };
  
  const handleInputChangeOne = (event) => {
    setInputValueOne(event.target.value);
    console.log(inputValueOne);
  };
  
  const handleInputChangeTwo = (event) => {
    setInputValueTwo(event.target.value);
    console.log(inputValueTwo);
  };

  return quizSentence ? (
    <Container>
      <QuestionMarkContainer>
        <QuestionMark />
      </QuestionMarkContainer>
      <CenterContainer>
        <LogoContainer>
          <H1 color="var(--secondary)">DANCHU</H1>
        </LogoContainer>
        <DateDanchuContentContainer>
          <H6Styled color="var(--secondary)">2023년 09월 14일의 </H6Styled>
          <H6Styled color="var(--primary)">&nbsp;단추</H6Styled>
          <H6Styled color="var(--secondary)">를 끼워보세요!</H6Styled>
        </DateDanchuContentContainer>
        <QuizContainer>
          {/* 퀴즈 몇 줄인지 받아서 일정 길이 이상이면 나눠서 보내기 */}

          <QuizSentenceContainer>
            <QuizSentenceAnswerContainer>
              {quizSentence &&
                quizSentence.split("^").map((item, idx) => (
                  <>
                    <H1>{item}</H1>
                    {idx < quizSentence.split("^").length - 1 ? (
                      active === idx ? (
                        <Answer color="var(--primary)">
                          <H2>{idx + 1}</H2>
                        </Answer>
                      ) : (
                        <Answer color="var(--secondary)">
                          <H2>{idx + 1}</H2>
                        </Answer>
                      )
                    ) : null}
                  </>
                ))}
            </QuizSentenceAnswerContainer>
          </QuizSentenceContainer>
        </QuizContainer>
        <TabContainer>
          <Tabs>
            <Tab
              count={quizCount}
              onClick={handleClick}
              active={active === 0}
              id={0}
            >
              <H3 id={0}>1</H3>
            </Tab>
            {quizCount === 1 ? null : (
              <Tab
                count={quizCount}
                onClick={handleClick}
                active={active === 1}
                id={1}
              >
                <H3 id={1}>2</H3>
              </Tab>
            )}
            {quizCount === 2 || quizCount === 1 ? null : (
              <Tab
                count={quizCount}
                onClick={handleClick}
                active={active === 2}
                id={2}
              >
                <H3 id={2}>3</H3>
              </Tab>
            )}
          </Tabs>
        </TabContainer>
        <ContentContainer>
          <Content active={active === 0}>
            <TextContainer>
              <InputStyle
                placeholder="단어를 추측해보세요"
                onChange={handleInputChange}
                required
                type="text"
              ></InputStyle>
              <SubmitButton onClick={onSubmit}>단추</SubmitButton>
            </TextContainer>
            <TableContainer>
              <Table>
                {/* <Thead> */}
                <tr>
                  <ThNumber>#</ThNumber>
                  <ThGuess>단어추측</ThGuess>
                  <ThPercent>유사도</ThPercent>
                  <ThRank>유사도 순위</ThRank>
                </tr>
                {/* </Thead> */}
                {/* <tbody> */}
                {localStorage.getItem("guess") &&
                  JSON.parse(localStorage.getItem("guess")).map(
                    (guess, idx) => (
                      <tr>
                        <TdNumber>{idx}</TdNumber>
                        <TdGuess>{guess}</TdGuess>
                        <TdPercent>7.0</TdPercent>
                        <TdRank>1000</TdRank>
                      </tr>
                    
                  ))}
                <tr>
                  <TdNumber>이름</TdNumber>
                  <TdGuess>이메일</TdGuess>
                  <TdPercent>7.0</TdPercent>
                  <TdRank>1000</TdRank>
                </tr>
                <tr>
                  <TdNumber>이름</TdNumber>
                  <TdGuess>이메일</TdGuess>
                  <TdPercent>7.0</TdPercent>
                  <TdRank>1000</TdRank>
                </tr>
                {/* </tbody> */}
              </Table>
            </TableContainer>
          </Content>
          <Content active={active === 1}>
            <TextContainer>
              <InputStyle
                placeholder="단어를 추측해보세요"
                onChange={handleInputChangeOne}
                required
                type="text"
              ></InputStyle>
              <SubmitButton onClick={onSubmitOne}>단추</SubmitButton>
            </TextContainer>
            <TableContainer>
              <Table>
                {/* <Thead> */}
                <tr>
                  <ThNumber>#</ThNumber>
                  <ThGuess>단어추측</ThGuess>
                  <ThPercent>유사도</ThPercent>
                  <ThRank>유사도 순위</ThRank>
                </tr>
                {localStorage.getItem("guessOne") &&
                  JSON.parse(localStorage.getItem("guessOne")).map(
                    (guess, idx) => (
                      <tr>
                        <TdNumber>{idx}</TdNumber>
                        <TdGuess>{guess}</TdGuess>
                        <TdPercent>7.0</TdPercent>
                        <TdRank>1000</TdRank>
                      </tr>
                    
                  ))}
                {/* </Thead> */}
                {/* <tbody> */}
                <tr>
                  <TdNumber>이름</TdNumber>
                  <TdGuess>이메일</TdGuess>
                  <TdPercent>7.0</TdPercent>
                  <TdRank>1000</TdRank>
                </tr>
                {/* </tbody> */}
              </Table>
            </TableContainer>
          </Content>
          <Content active={active === 2}>
            <TextContainer>
              <InputStyle
                placeholder="단어를 추측해보세요"
                onChange={handleInputChangeTwo}
                required
                type="text"
              ></InputStyle>
              <SubmitButton onClick={onSubmitTwo}>단추</SubmitButton>
            </TextContainer>
            <TableContainer>
              <Table>
                {/* <Thead> */}
                <tr>
                {localStorage.getItem("guessTwo") &&
                  JSON.parse(localStorage.getItem("guessTwo")).map(
                    (guess, idx) => (
                      <tr>
                        <TdNumber>{idx}</TdNumber>
                        <TdGuess>{guess}</TdGuess>
                        <TdPercent>7.0</TdPercent>
                        <TdRank>1000</TdRank>
                      </tr>
                    
                  ))}
                </tr>
                <tr>
                  <ThNumber>#</ThNumber>
                  <ThGuess>단어추측</ThGuess>
                  <ThPercent>유사도</ThPercent>
                  <ThRank>유사도 순위</ThRank>
                </tr>
                {/* </Thead> */}
                {/* <tbody> */}
                <tr>
                  <TdNumber>이름</TdNumber>
                  <TdGuess>이메일</TdGuess>
                  <TdPercent>7.0</TdPercent>
                  <TdRank>1000</TdRank>
                </tr>
                {/* </tbody> */}
              </Table>
            </TableContainer>
          </Content>
          <GiveUpContainer>
            <GiveUpButtonContainer>
              <Button onClick={confirmGiveUp}>포기하기</Button>
            </GiveUpButtonContainer>
          </GiveUpContainer>
        </ContentContainer>
      </CenterContainer>
    </Container>
  ) : null;
}
