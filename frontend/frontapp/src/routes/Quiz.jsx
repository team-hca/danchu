import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import H1 from "../components/H1";
import H3 from "../components/H3";
import Main from "../components/Main/Main";
import SubmitButton from "../components/SubmitButton";
import { Content, Tab, Tabs } from "../components/Tabs";
import QuestionMark from "../icon/QuestionMark";

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
  width: 100px;
  max-width: 100px;
  min-width: 100px;
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

const RecentTr = styled.tr`
  border-bottom: 1px solid var(--gray-300);
`;

export default function Quiz() {
  const [active, setActive] = useState(0);
  const [quizSentence, setQuizSentence] = useState();
  const [quizCount, setQuizCount] = useState();
  const [guess, setGuess] = useState();
  const [guessOne, setGuessOne] = useState();
  const [guessTwo, setGuessTwo] = useState();
  const [inputValue, setInputValue] = useState();
  const [inputValueOne, setInputValueOne] = useState();
  const [inputValueTwo, setInputValueTwo] = useState();
  const [recentGuess, setRecentGuess] = useState();
  const [recentGuessOne, setRecentGuessOne] = useState();
  const [recentGuessTwo, setRecentGuessTwo] = useState();
  const [recentCount, setRecentCount] = useState();
  const [recentCountOne, setRecentCountOne] = useState();
  const [recentCountTwo, setRecentCountTwo] = useState();
  const [inputInitialize, setInputInitialize] = useState();
  const [indexes, setIndexes] = useState();

  let today = new Date();

  const saveLocalStorage = () => {
    let arr = localStorage.getItem("guess")
      ? JSON.parse(localStorage.getItem("guess"))
      : [[], []];
    let obj = new Object();
    obj.word = inputValue;
    axios
      .get(
        `/api/v1/word/guess?quizNum=${indexes[0].substring(1, 2)}&guessWord=${
          obj.word
        }`
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
        obj.similarity = response.data.similarity;
        obj.rank = response.data.rank;

        obj.count = localStorage.getItem("guess")
          ? JSON.parse(localStorage.getItem("guess"))[0].length +
            JSON.parse(localStorage.getItem("guess"))[1].length +
            1
          : 1;
        if (obj.rank === -1) {
          if (!localStorage.getItem("guess")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuess(obj.word);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          } else if (localStorage.getItem("guess").includes(inputValue)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuess(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuess(obj.word);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          }
        } else {
          if (!localStorage.getItem("guess")) {
            // guess가 처음일 때
            arr[0].push(obj);
            setRecentGuess(obj.word);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          } else if (localStorage.getItem("guess").includes(inputValue)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuess(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[0].push(obj);
            setRecentGuess(obj.word);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          }
        }
        console.log(JSON.stringify(obj));
      })
      .catch((error) => {
        console.error("today quiz similarity request failed: " + error);
      });
  };
  const saveLocalStorageOne = () => {
    let arr = localStorage.getItem("guessOne")
      ? JSON.parse(localStorage.getItem("guessOne"))
      : [[], []];
    let obj = new Object();
    obj.word = inputValueOne;
    axios
      .get(
        `/api/v1/word/guess?quizNum=${indexes[1].substring(1, 2)}&guessWord=${
          obj.word
        }`
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
        obj.similarity = response.data.similarity;
        obj.rank = response.data.rank;

        obj.count = localStorage.getItem("guessOne")
          ? JSON.parse(localStorage.getItem("guessOne"))[0].length +
            JSON.parse(localStorage.getItem("guessOne"))[1].length +
            1
          : 1;
        if (obj.rank === -1) {
          if (!localStorage.getItem("guessOne")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuessOne(obj.word);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          } else if (localStorage.getItem("guessOne").includes(inputValueOne)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuess(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuess(obj.word);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          }
        } else {
          if (!localStorage.getItem("guessOne")) {
            // guess가 처음일 때
            arr[0].push(obj);
            setRecentGuessOne(obj.word);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          } else if (localStorage.getItem("guessOne").includes(inputValueOne)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessOne(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[0].push(obj);
            setRecentGuessOne(obj.word);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          }
        }
        console.log(JSON.stringify(obj));
      })
      .catch((error) => {
        console.error("today quiz similarity request failed: " + error);
      });
  };
  const saveLocalStorageTwo = () => {
    let arr = localStorage.getItem("guessTwo")
      ? JSON.parse(localStorage.getItem("guessTwo"))
      : [[], []];
    let obj = new Object();
    obj.word = inputValueTwo;
    axios
      .get(
        `/api/v1/word/guess?quizNum=${indexes[2].substring(1, 2)}&guessWord=${
          obj.word
        }`
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
        obj.similarity = response.data.similarity;
        obj.rank = response.data.rank;

        obj.count = localStorage.getItem("guessTwo")
          ? JSON.parse(localStorage.getItem("guessTwo"))[0].length +
            JSON.parse(localStorage.getItem("guessTwo"))[1].length +
            1
          : 1;
        if (obj.rank === -1) {
          if (!localStorage.getItem("guessTwo")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuessTwo(obj.word);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          } else if (localStorage.getItem("guessTwo").includes(inputValueTwo)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessTwo(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuessTwo(obj.word);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          }
        } else {
          if (!localStorage.getItem("guessTwo")) {
            // guess가 처음일 때
            arr[0].push(obj);
            setRecentGuessTwo(obj.word);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          } else if (localStorage.getItem("guessTwo").includes(inputValueTwo)) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessTwo(obj.word);
          } else {
            // guess가 있고 처음 추측할 때
            arr[0].push(obj);
            setRecentGuessTwo(obj.word);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          }
        }
        console.log(JSON.stringify(obj));
      })
      .catch((error) => {
        console.error("today quiz similarity request failed: " + error);
      });
  };

  const onSubmitOne = () => {
    if (inputValueOne.trim() === "" && !inputValueOne) {
      // setInputValueOne("");
    } else {
      recordStartTime();
      saveLocalStorageOne();
    }
  };

  const onSubmitTwo = () => {
    if (inputValueTwo.trim() === "" && !inputValueTwo) {
      // setInputValueTwo("");
    } else {
      recordStartTime();
      saveLocalStorageTwo();
    }
  };

  const recordStartTime = () => {
    if (localStorage.getItem("startTime")) {
      console.log(localStorage.getItem("startTime"));
    } else {
      localStorage.setItem("startTime", Date.now());
    }
  };

  const onSubmit = () => {
    if (
      inputValue !== "" &&
      inputValue &&
      inputValue.trim() === "" &&
      !inputValue
    ) {
    } else {
      recordStartTime();
      saveLocalStorage();
      return;
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      if (inputValue.trim() === "" && !inputValue) {
      } else {
        recordStartTime();
        saveLocalStorage();
      }
    }
  };
  const handleOnKeyPressOne = (e) => {
    if (e.key === "Enter") {
      if (inputValueOne.trim() === "" && !inputValueOne) {
      } else {
        recordStartTime();
        saveLocalStorageOne();
      }
    }
  };
  const handleOnKeyPressTwo = (e) => {
    if (e.key === "Enter") {
      if (inputValueTwo.trim() === "" && !inputValueTwo) {
      } else {
        recordStartTime();
        saveLocalStorageTwo();
      }
    }
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
        `/api/v1/quiz/today?date=${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
      )
      .then((response) => {
        const sentence = response.data;
        console.log(sentence);
        setQuizSentence(sentence);
        console.log("sentence : ", sentence);
        console.log("quizSentence: " + quizSentence);
        setQuizCount(response.data.count);
        console.log("quizcount: " + quizCount);
        setIndexes(response.data.indexes);
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
    handleQuiz();
    if (localStorage.getItem("guess")) {
      setGuess(localStorage.getItem("guess"));
      setRecentCount(JSON.parse(localStorage.getItem("guess")).length);
    }
    if (localStorage.getItem("guessOne")) {
      setGuessOne(localStorage.getItem("guessOne"));
      console.log("guessOne: " + guessOne);
    }
    if (localStorage.getItem("guessTwo")) {
      setGuessTwo(localStorage.getItem("guessTwo"));
      console.log("guessTwo: " + guessTwo);
    }
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log("zero: " + inputValue);
  };

  const handleInputChangeOne = (event) => {
    setInputValueOne(event.target.value);
    console.log("one: " + inputValueOne);
  };

  const handleInputChangeTwo = (event) => {
    setInputValueTwo(event.target.value);
    console.log("two: " + inputValueTwo);
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
        {/* <DateDanchuContentContainer>
          <H6Styled color="var(--secondary)">2023년 09월 14일의 </H6Styled>
          <H6Styled color="var(--primary)">&nbsp;단추</H6Styled>
          <H6Styled color="var(--secondary)">를 끼워보세요!</H6Styled>
        </DateDanchuContentContainer> */}
        {/* <QuizContainer>

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
         */}
        <Main sentence={quizSentence} />
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
                onKeyDown={handleOnKeyPress}
                value={inputInitialize}
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
                {recentGuess ? (
                  <>
                    <RecentTr>
                      {/* <TdNumber>{JSON.parse(localStorage.getItem("guess"))}</TdNumber> */}
                      <TdNumber>
                        {JSON.parse(localStorage.getItem("guess"))[0].length >
                          0 &&
                        JSON.parse(localStorage.getItem("guess"))[0].some(
                          (g) => g.word === recentGuess
                        ).count
                          ? JSON.parse(localStorage.getItem("guess"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guess"))[0].find(
                              (item, index, arr) => {
                                setRecentGuess(inputValue);
                                return item.word === recentGuess;
                              }
                            ).count
                          : localStorage.getItem("guess") &&
                            JSON.parse(localStorage.getItem("guess"))[1]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guess"))[1].find(
                              (item, index, arr) => {
                                setRecentGuess(inputValue);
                                console.log("item.word: " + item.word);
                                console.log("recentGuess: " + recentGuess);
                                return item.word === recentGuess;
                              }
                            ).count}
                      </TdNumber>
                      <TdGuess>{recentGuess}</TdGuess>
                      <TdPercent>
                        {localStorage.getItem("guess") &&
                        JSON.parse(localStorage.getItem("guess"))[0] &&
                        JSON.parse(localStorage.getItem("guess"))[0].some(
                          (g) => g.word === recentGuess
                        ).similarity
                          ? localStorage.getItem("guess") &&
                            JSON.parse(localStorage.getItem("guess"))[0] &&
                            JSON.parse(localStorage.getItem("guess"))[0]
                              .find((item, index, arr) => {
                                return item.word === recentGuess;
                              })
                              .similarity.toFixed(2)
                          : localStorage.getItem("guess") &&
                            JSON.parse(localStorage.getItem("guess"))[1] &&
                            JSON.parse(localStorage.getItem("guess"))[1]
                              .find((item, index, arr) => {
                                return item.word === recentGuess;
                              })
                              .similarity.toFixed(2)}
                      </TdPercent>
                      <TdRank>
                        {JSON.parse(localStorage.getItem("guess"))[0].length >
                          0 &&
                        JSON.parse(localStorage.getItem("guess"))[0].some(
                          (g) => g.word === recentGuess
                        )
                          ? JSON.parse(localStorage.getItem("guess"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guess"))[0].find(
                              (item, index, arr) => {
                                return item.word === recentGuess;
                              }
                            ).rank
                          : JSON.parse(localStorage.getItem("guess"))[1]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guess"))[1].find(
                              (item, index, arr) => {
                                return item.word === recentGuess;
                              }
                            ).rank}
                      </TdRank>
                    </RecentTr>
                  </>
                ) : null}
                {localStorage.getItem("guess") != null &&
                  JSON.parse(localStorage.getItem("guess"))[0] &&
                  JSON.parse(localStorage.getItem("guess"))[0].map(
                    (guess, idx) =>
                      guess.word === recentGuess ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
                {localStorage.getItem("guess") != null &&
                  JSON.parse(localStorage.getItem("guess"))[1] &&
                  JSON.parse(localStorage.getItem("guess"))[1].map(
                    (guess, idx) =>
                      guess.word === recentGuess ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
                {/* </tbody> */}
              </Table>
            </TableContainer>
          </Content>
          <Content active={active === 1}>
            <TextContainer>
              <InputStyle
                placeholder="단어를 추측해보세요"
                onChange={handleInputChangeOne}
                onKeyDown={handleOnKeyPressOne}
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
                {recentGuessOne ? (
                  <>
                    <RecentTr>
                      <TdNumber>
                        {JSON.parse(localStorage.getItem("guessOne"))[0] &&
                        JSON.parse(localStorage.getItem("guessOne"))[0].some(
                          (g) => g.word === recentGuessOne
                        ).count
                          ? JSON.parse(localStorage.getItem("guessOne"))[0] &&
                            JSON.parse(
                              localStorage.getItem("guessOne")
                            )[0].find((item, index, arr) => {
                              return item.word === recentGuessOne;
                            }).count
                          : localStorage.getItem("guessOne") &&
                            JSON.parse(localStorage.getItem("guessOne"))[1] &&
                            JSON.parse(
                              localStorage.getItem("guessOne")
                            )[1].find((item, index, arr) => {
                              console.log("item.word: " + item.word);
                              console.log("recentGuessOne: " + recentGuessOne);
                              return item.word === recentGuessOne;
                            }).count}
                      </TdNumber>
                      <TdGuess>{recentGuessOne}</TdGuess>
                      <TdPercent>
                        {localStorage.getItem("guessOne") &&
                        JSON.parse(localStorage.getItem("guessOne"))[0] &&
                        JSON.parse(localStorage.getItem("guessOne"))[0].some(
                          (g) => g.word === recentGuessOne
                        ).similarity
                          ? localStorage.getItem("guessOne") &&
                            JSON.parse(localStorage.getItem("guessOne"))[0] &&
                            JSON.parse(localStorage.getItem("guessOne"))[0]
                              .find((item, index, arr) => {
                                return item.word === recentGuessOne;
                              })
                              .similarity.toFixed(2)
                          : localStorage.getItem("guessOne") &&
                            JSON.parse(localStorage.getItem("guessOne"))[1] &&
                            JSON.parse(localStorage.getItem("guessOne"))[1]
                              .find((item, index, arr) => {
                                return item.word === recentGuessOne;
                              })
                              .similarity.toFixed(2)}
                      </TdPercent>
                      <TdRank>
                        {JSON.parse(localStorage.getItem("guessOne"))[0]
                          .length > 0 &&
                        JSON.parse(localStorage.getItem("guessOne"))[0].some(
                          (g) => g.word === recentGuessOne
                        )
                          ? JSON.parse(localStorage.getItem("guessOne"))[0]
                              .length > 0 &&
                            JSON.parse(
                              localStorage.getItem("guessOne")
                            )[0].find((item, index, arr) => {
                              return item.word === recentGuessOne;
                            }).rank
                          : JSON.parse(localStorage.getItem("guessOne"))[1]
                              .length > 0 &&
                            JSON.parse(
                              localStorage.getItem("guessOne")
                            )[1].find((item, index, arr) => {
                              return item.word === recentGuessOne;
                            }).rank}
                      </TdRank>
                    </RecentTr>
                  </>
                ) : null}
                {localStorage.getItem("guessOne") != null &&
                  JSON.parse(localStorage.getItem("guessOne"))[0] &&
                  JSON.parse(localStorage.getItem("guessOne"))[0].map(
                    (guess, idx) =>
                      guess.word === recentGuessOne ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
                {localStorage.getItem("guessOne") != null &&
                  JSON.parse(localStorage.getItem("guessOne"))[1] &&
                  JSON.parse(localStorage.getItem("guessOne"))[1].map(
                    (guess, idx) =>
                      guess.word === recentGuessOne ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
                {/* </Thead> */}
                {/* <tbody> */}

                {/* </tbody> */}
              </Table>
            </TableContainer>
          </Content>
          <Content active={active === 2}>
            <TextContainer>
              <InputStyle
                placeholder="단어를 추측해보세요"
                onChange={handleInputChangeTwo}
                onKeyDown={handleOnKeyPressTwo}
                required
                type="text"
              ></InputStyle>
              <SubmitButton onClick={onSubmitTwo}>단추</SubmitButton>
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
                {recentGuessTwo ? (
                  <>
                    <RecentTr>
                      {/* <TdNumber>{JSON.parse(localStorage.getItem("guess"))}</TdNumber> */}
                      <TdNumber>
                        {JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                        JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                          (g) => g.word === recentGuessTwo
                        ).count
                          ? JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                            JSON.parse(
                              localStorage.getItem("guessTwo")
                            )[0].find((item, index, arr) => {
                              return item.word === recentGuessTwo;
                            }).count
                          : localStorage.getItem("guessTwo") &&
                            JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                            JSON.parse(
                              localStorage.getItem("guessTwo")
                            )[1].find((item, index, arr) => {
                              console.log("item.word: " + item.word);
                              console.log("recentGuessTwo: " + recentGuessTwo);
                              return item.word === recentGuessTwo;
                            }).count}
                      </TdNumber>
                      <TdGuess>{recentGuessTwo}</TdGuess>
                      <TdPercent>
                        {localStorage.getItem("guessTwo") &&
                        JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                        JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                          (g) => g.word === recentGuessTwo
                        ).similarity
                          ? localStorage.getItem("guessTwo") &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0]
                              .find((item, index, arr) => {
                                return item.word === recentGuessTwo;
                              })
                              .similarity.toFixed(2)
                          : localStorage.getItem("guessTwo") &&
                            JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                            JSON.parse(localStorage.getItem("guessTwo"))[1]
                              .find((item, index, arr) => {
                                return item.word === recentGuessTwo;
                              })
                              .similarity.toFixed(2)}
                      </TdPercent>
                      <TdRank>
                        {JSON.parse(localStorage.getItem("guessTwo"))[0]
                          .length > 0 &&
                        JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                          (g) => g.word === recentGuessTwo
                        )
                          ? JSON.parse(localStorage.getItem("guessTwo"))[0]
                              .length > 0 &&
                            JSON.parse(
                              localStorage.getItem("guessTwo")
                            )[0].find((item, index, arr) => {
                              return item.word === recentGuessTwo;
                            }).rank
                          : JSON.parse(localStorage.getItem("guessTwo"))[1]
                              .length > 0 &&
                            JSON.parse(
                              localStorage.getItem("guessTwo")
                            )[1].find((item, index, arr) => {
                              return item.word === recentGuessTwo;
                            }).rank}
                      </TdRank>
                    </RecentTr>
                  </>
                ) : null}
                {localStorage.getItem("guessTwo") != null &&
                  JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                  JSON.parse(localStorage.getItem("guessTwo"))[0].map(
                    (guess, idx) =>
                      guess.word === recentGuessTwo ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
                {localStorage.getItem("guessTwo") != null &&
                  JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                  JSON.parse(localStorage.getItem("guessTwo"))[1].map(
                    (guess, idx) =>
                      guess.word === recentGuessTwo ? null : (
                        <tr>
                          <TdNumber>{guess.count}</TdNumber>
                          <TdGuess>{guess.word}</TdGuess>
                          <TdPercent>
                            {guess.similarity
                              ? guess.similarity.toFixed(2)
                              : guess.similarity}
                          </TdPercent>
                          <TdRank>{guess.rank}</TdRank>
                        </tr>
                      )
                  )}
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
