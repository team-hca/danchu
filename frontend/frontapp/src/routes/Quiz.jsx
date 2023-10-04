import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import Header from "../components/Common/Header";
import H3 from "../components/H3";
import Main from "../components/Main/Main";
import SubmitButton from "../components/SubmitButton";
import { Content, Tab, Tabs } from "../components/Tabs";
import sortGuess from "../util/sortGuess";
import Footer from "../components/Common/Footer";

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
  border-radius: ${({ count }) => (count === 1 ? '18px' : '0 0 18px 18px')};
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
  const [inputInitializeOne, setInputInitializeOne] = useState();
  const [inputInitializeTwo, setInputInitializeTwo] = useState();
  const [indexes, setIndexes] = useState();
  const navigate = useNavigate();

  const giveUpConfirm = () => {
    alert("포기했습니다.");
    localStorage.setItem("winState", 0); // 1. winState 변경

    // 2. startTime 없으면 세팅
    if (!localStorage.getItem("startTime")) {
      localStorage.setItem("startTime", Date.now());
    }

    let obj = new Object();
    // 3. 정답 가져오기
    axios
    .get(
      `/v1/quiz/answer?winState=${parseInt(localStorage.getItem("winState"))}&date=${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}
      }`
    )
    .then((response) => {
      obj.count = response.data.count;
      obj.answers = response.data.answers;

      // 4. 정답 넣기
      let arr = localStorage.getItem("guess") // 1번 문제
      ? JSON.parse(localStorage.getItem("guess"))
      : [[], []];

      let tmpObj = new Object();
      tmpObj.word = obj.answers[0];      tmpObj.similarity = 100;
      tmpObj.rank = 0;
      tmpObj.count = arr[0].length + arr[1].length + 1;
      if ((!localStorage.getItem("guess")) || (JSON.parse(localStorage.getItem("guess"))[0][0]["word"] !== obj.answers[0])) {
        arr[0].unshift(tmpObj);
        localStorage.setItem("guess", JSON.stringify(arr));
      }

      if (obj.count >= 2) { // 2번 문제
        arr = localStorage.getItem("guessOne")
        ? JSON.parse(localStorage.getItem("guessOne"))
        : [[], []];

        tmpObj = new Object();
        tmpObj.word = obj.answers[1];
        tmpObj.similarity = 100;
        tmpObj.rank = 0;
        tmpObj.count = arr[0].length + arr[1].length + 1;

        if ((!localStorage.getItem("guessOne")) || (JSON.parse(localStorage.getItem("guessOne"))[0][0]["word"] !== obj.answers[0])) {
          arr[0].unshift(tmpObj);
          localStorage.setItem("guessOne", JSON.stringify(arr));
        }
      }

      if (obj.count === 3) { // 3번 문제
        arr = localStorage.getItem("guessTwo")
        ? JSON.parse(localStorage.getItem("guessTwo"))
        : [[], []];

        tmpObj = new Object();
        tmpObj.word = obj.answers[2];
        tmpObj.similarity = 100;
        tmpObj.rank = 0;
        tmpObj.count = arr[0].length + arr[1].length + 1;

        if ((!localStorage.getItem("guessTwo")) || (JSON.parse(localStorage.getItem("guessTwo"))[0][0]["word"] !== obj.answers[0])) {
          arr[0].unshift(tmpObj);
          localStorage.setItem("guessTwo", JSON.stringify(arr));
        }
      }
      
    })
    .catch((error) => {
      console.error("quiz answer request failed: ", error);
    });

    // if (quizCount === 1) {
    //   let arr = localStorage.getItem("guess")? JSON.parse(localStorage.getItem("guess")): [[],[]];
    //   let obj = new Object();

    // }
    navigate("/congrat");
  };
  const cancelConfirm = () => {
    alert("취소했습니다.");
  };
  const confirmGiveUp = onClickGiveUp(
    // todo 포기 로직 작성
    "포기하면 '오늘의 단추'가 모두 포기상태가 됩니다. 그래도 포기하시겠습니까?",
    giveUpConfirm,
    cancelConfirm
  );

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
        // alert("bbb");
        if (obj.similarity === 100.0) {
          // alert("aaa");
          if (quizCount === 1) {
            localStorage.setItem("winState", 1);
            navigate("/congrat");
          } else if (quizCount === 2) {
            if (
              JSON.parse(localStorage.getItem("guessOne")) &&
              JSON.parse(localStorage.getItem("guessOne"))[0].length > 0 &&
              JSON.parse(localStorage.getItem("guessOne"))[0][0].rank === 0
            ) {
              localStorage.setItem("winState", 1);
              navigate("/congrat");
            } else {
              // alert("에");
              alert("1번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            }
          } else {
            if (
              localStorage.getItem("guessOne") &&
              JSON.parse(localStorage.getItem("guessOne"))[0].length > 0 &&
              JSON.parse(localStorage.getItem("guessOne"))[0][0].rank === 0
            ) {
              if (
                localStorage.getItem("guessTwo") &&
                JSON.parse(localStorage.getItem("guessTwo"))[0].length > 0 &&
                JSON.parse(localStorage.getItem("guessTwo"))[0][0].rank === 0
              ) {
                localStorage.setItem("winState", 1);
                navigate("/congrat");
              } else {
                // alert("에에");
                alert("1번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
              }
            } else {
              // alert("에에에: " + JSON.stringify(JSON.parse(localStorage.getItem("guessTwo"))[0][0].rank));
              alert("1번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            }
          }
        }
        if (obj.rank === -1) {
          // alert("a");
          if (!localStorage.getItem("guess")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuess(obj);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          } else if (
            JSON.parse(localStorage.getItem("guess"))[1].some(
              (g) => g.word === inputValue
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때

            setRecentGuess(obj);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuess(obj);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          }
        } else {
          // alert("b");
          if (!localStorage.getItem("guess")) {
            // guess가 처음일 때
            // alert("one");
            arr[0].push(obj);
            setRecentGuess(obj);
            localStorage.setItem("guess", JSON.stringify(arr));
            setGuess(JSON.parse(localStorage.getItem("guess")));
          } else if (
            JSON.parse(localStorage.getItem("guess"))[0].some(
              (g) => g.word === inputValue
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때
            // alert("two");
            setRecentGuess(obj);
          } else {
            // guess가 있고 처음 추측할 때
            // alert("three");
            arr[0].push(obj);
            setRecentGuess(obj);
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
        if (obj.similarity === 100.0) {
          // alert("aaa");
          if (quizCount === 1) {
            // localStorage.setItem("winState", 1);
            // navigate("/congrat");
            console.error("2번 단추가 있는데 퀴즈 카운트가 1임");
          } else if (quizCount === 2) {
            if (
              JSON.parse(localStorage.getItem("guess")) &&
              JSON.parse(localStorage.getItem("guess"))[0].length > 0 &&
              JSON.parse(localStorage.getItem("guessOne"))[0][0].rank === 0
            ) {
              localStorage.setItem("winState", 1);
              navigate("/congrat");
            } else {
              // alert("에");
              alert("2번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            }
          } else {
            if (
              localStorage.getItem("guess") &&
              JSON.parse(localStorage.getItem("guess"))[0].length > 0 &&
              JSON.parse(localStorage.getItem("guess"))[0][0].rank === 0
            ) {
              if (
                localStorage.getItem("guessTwo") &&
                JSON.parse(localStorage.getItem("guessTwo"))[0].length > 0 &&
                JSON.parse(localStorage.getItem("guessTwo"))[0][0].rank === 0
              ) {
                localStorage.setItem("winState", 1);
                navigate("/congrat");
              } else {
                // alert("에에");
                alert("2번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
              }
            } else {
              // alert("에에에: " + JSON.stringify(JSON.parse(localStorage.getItem("guessTwo"))[0][0].rank));
              alert("2번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            }
          }
        }
        if (obj.rank === -1) {
          if (!localStorage.getItem("guessOne")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuessOne(obj);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          } else if (
            JSON.parse(localStorage.getItem("guessOne"))[1].some(
              (g) => g.word === inputValueOne
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessOne(obj);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuessOne(obj);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          }
        } else {
          if (!localStorage.getItem("guessOne")) {
            // guess가 처음일 때
            arr[0].push(obj);
            setRecentGuessOne(obj);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          } else if (
            JSON.parse(localStorage.getItem("guessOne"))[0].some(
              (g) => g.word === inputValueOne
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessOne(obj);
          } else {
            // guess가 있고 처음 추측할 때
            arr[0].push(obj);
            setRecentGuessOne(obj);
            localStorage.setItem("guessOne", JSON.stringify(arr));
            setGuessOne(JSON.parse(localStorage.getItem("guessOne")));
          }
        }
        console.log(JSON.stringify(obj));
      })
      .catch((error) => {
        console.error("today quiz similarity One request failed: " + error);
      });
  };
  const saveLocalStorageTwo = () => {
    // let arr = localStorage.getItem("guessTwo")
    //   ? JSON.parse(localStorage.getItem("guessTwo"))
    //   : [[], []];
    // let obj = new Object();
    // obj.word = inputValueTwo;
    // axios
    //   .get(
    //     `/api/v1/word/guess?quizNum=${indexes[2].substring(1, 2)}&guessWord=${
    //       obj.word
    //     }`
    //   )
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //     obj.similarity = response.data.similarity;
    //     obj.rank = response.data.rank;

    //     obj.count = localStorage.getItem("guessTwo")
    //       ? JSON.parse(localStorage.getItem("guessTwo"))[0].length +
    //         JSON.parse(localStorage.getItem("guessTwo"))[1].length +
    //         1
    //       : 1;
    //     if (obj.rank === -1) {
    //       if (!localStorage.getItem("guessTwo")) {
    //         // guess가 처음일 때
    //         arr[1].push(obj);
    //         setRecentGuessTwo(obj.word);
    //         localStorage.setItem("guessTwo", JSON.stringify(arr));
    //         setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
    //       } else if (localStorage.getItem("guessTwo").includes(inputValueTwo)) {
    //         // guess가 있는데 이미 추측한 게 있을 때
    //         setRecentGuessTwo(obj.word);
    //       } else {
    //         // guess가 있고 처음 추측할 때
    //         arr[1].push(obj);
    //         setRecentGuessTwo(obj.word);
    //         localStorage.setItem("guessTwo", JSON.stringify(arr));
    //         setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
    //       }
    //     } else {
    //       if (!localStorage.getItem("guessTwo")) {
    //         // guess가 처음일 때
    //         arr[0].push(obj);
    //         setRecentGuessTwo(obj.word);
    //         localStorage.setItem("guessTwo", JSON.stringify(arr));
    //         setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
    //       } else if (localStorage.getItem("guessTwo").includes(inputValueTwo)) {
    //         // guess가 있는데 이미 추측한 게 있을 때
    //         setRecentGuessTwo(obj.word);
    //       } else {
    //         // guess가 있고 처음 추측할 때
    //         arr[0].push(obj);
    //         setRecentGuessTwo(obj.word);
    //         localStorage.setItem("guessTwo", JSON.stringify(arr));
    //         setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
    //       }
    //     }
    //     console.log(JSON.stringify(obj));
    //   })
    //   .catch((error) => {
    //     console.error("today quiz similarity request failed: " + error);
    //   });
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
        if (obj.similarity === 100.0) {
          // alert("aaa");
          if (quizCount === 1) {
            // localStorage.setItem("winState", 1);
            // navigate("/congrat");
            console.error("3번이 있는데 퀴즈 카운트가 1임");
          } else if (quizCount === 2) {
            // if(JSON.parse(localStorage.getItem("guessOne")) && JSON.parse(localStorage.getItem("guessOne"))[0].length>0 && JSON.parse(localStorage.getItem("guessOne"))[0][0].rank===0) {
            //   localStorage.setItem("winState", 1);
            //   navigate("/congrat");
            // }else{
            //   // alert("에");
            //   alert("1번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            // }
            console.error("3번이 있는데 퀴즈 카운트가 2임");
          } else {
            if (
              localStorage.getItem("guess") &&
              JSON.parse(localStorage.getItem("guess"))[0].length > 0 &&
              JSON.parse(localStorage.getItem("guess"))[0][0].rank === 0
            ) {
              if (
                localStorage.getItem("guessOne") &&
                JSON.parse(localStorage.getItem("guessOne"))[0].length > 0 &&
                JSON.parse(localStorage.getItem("guessOne"))[0][0].rank === 0
              ) {
                localStorage.setItem("winState", 1);
                navigate("/congrat");
              } else {
                // alert("에에");
                alert("3번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
              }
            } else {
              // alert("에에에: " + JSON.stringify(JSON.parse(localStorage.getItem("guessTwo"))[0][0].rank));
              alert("3번 단추를 맞혔습니다!\n나머지 단추도 모두 맞혀보세요!");
            }
          }
        }
        if (obj.rank === -1) {
          if (!localStorage.getItem("guessTwo")) {
            // guess가 처음일 때
            arr[1].push(obj);
            setRecentGuessTwo(obj);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          } else if (
            JSON.parse(localStorage.getItem("guessTwo"))[1].some(
              (g) => g.word === inputValueTwo
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessTwo(obj);
          } else {
            // guess가 있고 처음 추측할 때
            arr[1].push(obj);
            setRecentGuessTwo(obj);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          }
        } else {
          if (!localStorage.getItem("guessTwo")) {
            // guess가 처음일 때
            arr[0].push(obj);
            setRecentGuessTwo(obj);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          } else if (
            JSON.parse(localStorage.getItem("guessTwo"))[0].some(
              (g) => g.word === inputValueTwo
            )
          ) {
            // guess가 있는데 이미 추측한 게 있을 때
            setRecentGuessTwo(obj);
          } else {
            // guess가 있고 처음 추측할 때
            arr[0].push(obj);
            setRecentGuessTwo(obj);
            localStorage.setItem("guessTwo", JSON.stringify(arr));
            setGuessTwo(JSON.parse(localStorage.getItem("guessTwo")));
          }
        }
        console.log(JSON.stringify(obj));
      })
      .catch((error) => {
        console.error("today quiz similarity Two request failed: " + error);
      });
  };

  const onSubmitOne = () => {
    if (
      inputValueOne !== "" &&
      inputValueOne &&
      inputValueOne.trim() === "" &&
      !inputValueOne
    ) {
      // setInputValueOne("");
    } else {
      recordStartTime();
      saveLocalStorageOne();
      sortGuess("guessOne");
      setInputInitializeOne("");
      return;
    }
  };

  const onSubmitTwo = () => {
    if (
      inputValueTwo !== "" &&
      inputValueTwo &&
      inputValueTwo.trim() === "" &&
      !inputValueTwo
    ) {
      // setInputValueTwo("");
    } else {
      recordStartTime();
      saveLocalStorageTwo();
      sortGuess("guessTwo");
      setInputInitializeTwo("");
      return;
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
      sortGuess("guess");
      setInputInitialize("");
      return;
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      if (inputValue.trim() === "" || !inputValue) {
      } else {
        onSubmit();
      }
    }
  };
  const handleOnKeyPressOne = (e) => {
    if (e.key === "Enter") {
      if (inputValueOne.trim() === "" && !inputValueOne) {
      } else {
        onSubmitOne();
      }
    }
  };
  const handleOnKeyPressTwo = (e) => {
    if (e.key === "Enter") {
      if (inputValueTwo.trim() === "" && !inputValueTwo) {
      } else {
        onSubmitTwo();
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
        console.log("quizSentence: " + quizSentence);
        setQuizCount(response.data.count);
        console.log("quizcount: " + quizCount);
        setIndexes(response.data.indexes);
        if (!localStorage.getItem("date")) {
          localStorage.setItem(
            "date",
            `${today.getFullYear()}-${(today.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
          );
        }
        if (!localStorage.getItem("winState")) {
          localStorage.setItem("winState", -1);
        }
        const storedStartTimeTimestamp = parseInt(localStorage.getItem("startTime"), 10);
        if (!isNaN(storedStartTimeTimestamp)) { //이미 저장된 스타트타임 있는 경우만
          const storedStartTime = new Date(storedStartTimeTimestamp);
          const currentDate = new Date();
          //오늘 날짜와 다르다면
          if(storedStartTime.getDate() !== currentDate.getDate() ||
            storedStartTime.getMonth() !== currentDate.getMonth() ||
            storedStartTime.getFullYear() !== currentDate.getFullYear()){
              console.log("시작시간과 오늘날짜가 다릅니다.");
              localStorage.removeItem("startTime");
        }
        }
      })
      .catch((error) => {
        console.error("today quiz request failed: ", error);
      });
  };

  useEffect(() => {

    const todayDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    if (localStorage.getItem("date") && localStorage.getItem("date") !== todayDate) {
      localStorage.clear();
    }

    sortGuess("guess");
    sortGuess("guessOne");
    sortGuess("guessTwo");

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
    setInputInitialize(event.target.value);
    setInputValue(event.target.value);
    console.log("zero: " + inputValue);
  };

  const handleInputChangeOne = (event) => {
    setInputInitializeOne(event.target.value);
    setInputValueOne(event.target.value);
    console.log("one: " + inputValueOne);
  };

  const handleInputChangeTwo = (event) => {
    setInputInitializeTwo(event.target.value);
    setInputValueTwo(event.target.value);
    console.log("two: " + inputValueTwo);
  };

  return (
    quizSentence ? (
      <>
        <Container>
          <Header />
          <CenterContainer>
            <Main quizInfo={quizSentence} active={active} />
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
            <ContentContainer count={quizCount}>
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
                    {recentGuess && Object.keys(recentGuess).includes("word") ? (
                      <>
                        <RecentTr>
                          <TdNumber>
                            {JSON.parse(localStorage.getItem("guess"))[0].length >
                              0 &&
                            JSON.parse(localStorage.getItem("guess"))[0].some(
                              (g) => g.word === recentGuess.word
                            )
                              ? JSON.parse(localStorage.getItem("guess"))[0]
                                  .length > 0 &&
                                JSON.parse(localStorage.getItem("guess"))[0].find(
                                  (item, index, arr) => {
                                    // setRecentGuess(inputValue);
                                    console.log("guess-item.word: " + item.word);
                                    console.log(
                                      "guess-recentGuess: " + recentGuess.word
                                    );
                                    return item.word === recentGuess.word;
                                  }
                                ).count
                              : localStorage.getItem("guess") &&
                                JSON.parse(localStorage.getItem("guess"))[1]
                                  .length > 0 &&
                                JSON.parse(localStorage.getItem("guess"))[1].find(
                                  (item, index, arr) => {
                                    // setRecentGuess(inputValue);
                                    console.log("item.word: " + item.word);
                                    console.log("recentGuess: " + recentGuess.word);
                                    return item.word === recentGuess.word;
                                  }
                                )
                              ? localStorage.getItem("guess") &&
                                JSON.parse(localStorage.getItem("guess"))[1]
                                  .length > 0 &&
                                JSON.parse(localStorage.getItem("guess"))[1].find(
                                  (item, index, arr) => {
                                    // setRecentGuess(inputValue);
                                    console.log("item.word: " + item.word);
                                    console.log("recentGuess: " + recentGuess.word);
                                    return item.word === recentGuess.word;
                                  }
                                ).count
                              : recentGuess.count}
                          </TdNumber>
                          <TdGuess>{recentGuess.word}</TdGuess>
                          <TdPercent>
                            {localStorage.getItem("guess") &&
                            JSON.parse(localStorage.getItem("guess"))[0] &&
                            JSON.parse(localStorage.getItem("guess"))[0].some(
                              (g) => g.word === recentGuess.word
                            )
                              ? localStorage.getItem("guess") &&
                                JSON.parse(localStorage.getItem("guess"))[0] &&
                                JSON.parse(localStorage.getItem("guess"))[0]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  })
                                  .similarity.toFixed(2)
                              : localStorage.getItem("guess") &&
                                JSON.parse(localStorage.getItem("guess"))[1] &&
                                JSON.parse(localStorage.getItem("guess"))[1].find(
                                  (item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  }
                                )
                              ? localStorage.getItem("guess") &&
                                JSON.parse(localStorage.getItem("guess"))[1] &&
                                JSON.parse(localStorage.getItem("guess"))[1]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  })
                                  .similarity.toFixed(2)
                              : recentGuess.similarity.toFixed(2)}
                          </TdPercent>
                          <TdRank>
                            {JSON.parse(localStorage.getItem("guess"))[0].length >
                              0 &&
                            JSON.parse(localStorage.getItem("guess"))[0].some(
                              (g) => g.word === recentGuess.word
                            )
                              ? JSON.parse(localStorage.getItem("guess"))[0].find(
                                  (item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  }
                                ).rank === 0
                                ? "정답!"
                                : JSON.parse(localStorage.getItem("guess"))[0].find(
                                    (item, index, arr) => {
                                      return item.word === recentGuess.word;
                                    }
                                  ).rank
                              : JSON.parse(localStorage.getItem("guess"))[1]
                                  .length > 0 &&
                                JSON.parse(localStorage.getItem("guess"))[1].find(
                                  (item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  }
                                )
                              ? JSON.parse(localStorage.getItem("guess"))[1].find(
                                  (item, index, arr) => {
                                    return item.word === recentGuess.word;
                                  }
                                ).rank === -1
                                ? "1000위 이상"
                                : "이상"
                              : recentGuess.rank === -1
                              ? "1000위 이상"
                              : "이상"}
                          </TdRank>
                        </RecentTr>
                      </>
                    ) : null}
                    {localStorage.getItem("guess") != null &&
                      JSON.parse(localStorage.getItem("guess"))[0] &&
                      JSON.parse(localStorage.getItem("guess"))[0].map(
                        (guess, idx) =>
                          recentGuess &&
                          Object.keys(recentGuess).includes("word") ? (
                            guess.word === recentGuess.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === 0 ? "정답!" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === 0 ? "정답!" : guess.rank}
                              </TdRank>
                            </tr>
                          )
                      )}
                    {localStorage.getItem("guess") != null &&
                      JSON.parse(localStorage.getItem("guess"))[1] &&
                      JSON.parse(localStorage.getItem("guess"))[1].map(
                        (guess, idx) =>
                          recentGuess &&
                          Object.keys(recentGuess).includes("word") ? (
                            guess.word === recentGuess.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === -1 ? "1000위 이상" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === -1 ? "1000위 이상" : guess.rank}
                              </TdRank>
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
                    required
                    type="text"
                    onKeyDown={handleOnKeyPressOne}
                    value={inputInitializeOne}
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
                    {recentGuessOne &&
                    Object.keys(recentGuessOne).includes("word") ? (
                      <>
                        <RecentTr>
                          <TdNumber>
                            {JSON.parse(localStorage.getItem("guessOne"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guessOne"))[0].some(
                              (g) => g.word === recentGuessOne.word
                            )
                              ? JSON.parse(localStorage.getItem("guessOne"))[0]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[0].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("guess-item.wordOne: " + item.word);
                                  console.log(
                                    "guess-recentGuessOne: " + recentGuessOne.word
                                  );
                                  return item.word === recentGuessOne.word;
                                }).count
                              : localStorage.getItem("guessOne") &&
                                JSON.parse(localStorage.getItem("guessOne"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[1].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("item.wordOne: " + item.word);
                                  console.log(
                                    "recentGuessOne: " + recentGuessOne.word
                                  );
                                  return item.word === recentGuessOne.word;
                                })
                              ? localStorage.getItem("guessOne") &&
                                JSON.parse(localStorage.getItem("guessOne"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[1].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("item.word: " + item.word);
                                  console.log(
                                    "recentGuessOne: " + recentGuessOne.word
                                  );
                                  return item.word === recentGuessOne.word;
                                }).count
                              : recentGuessOne.count}
                          </TdNumber>
                          <TdGuess>{recentGuessOne.word}</TdGuess>
                          <TdPercent>
                            {localStorage.getItem("guessOne") &&
                            JSON.parse(localStorage.getItem("guessOne"))[0] &&
                            JSON.parse(localStorage.getItem("guessOne"))[0].some(
                              (g) => g.word === recentGuessOne.word
                            )
                              ? localStorage.getItem("guessOne") &&
                                JSON.parse(localStorage.getItem("guessOne"))[0] &&
                                JSON.parse(localStorage.getItem("guessOne"))[0]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuessOne.word;
                                  })
                                  .similarity.toFixed(2)
                              : localStorage.getItem("guessOne") &&
                                JSON.parse(localStorage.getItem("guessOne"))[1] &&
                                JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessOne.word;
                                })
                              ? localStorage.getItem("guessOne") &&
                                JSON.parse(localStorage.getItem("guessOne"))[1] &&
                                JSON.parse(localStorage.getItem("guessOne"))[1]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuessOne.word;
                                  })
                                  .similarity.toFixed(2)
                              : recentGuessOne.similarity.toFixed(2)}
                          </TdPercent>
                          <TdRank>
                            {JSON.parse(localStorage.getItem("guessOne"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guessOne"))[0].some(
                              (g) => g.word === recentGuessOne.word
                            )
                              ? JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[0].find((item, index, arr) => {
                                  return item.word === recentGuessOne.word;
                                }).rank === 0
                                ? "정답!"
                                : JSON.parse(
                                    localStorage.getItem("guessOne")
                                  )[0].find((item, index, arr) => {
                                    return item.word === recentGuessOne.word;
                                  }).rank
                              : JSON.parse(localStorage.getItem("guessOne"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessOne.word;
                                })
                              ? JSON.parse(
                                  localStorage.getItem("guessOne")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessOne.word;
                                }).rank === -1
                                ? "1000위 이상"
                                : "이상"
                              : recentGuessOne.rank === -1
                              ? "1000위 이상"
                              : "이상"}
                          </TdRank>
                        </RecentTr>
                      </>
                    ) : null}

                    {localStorage.getItem("guessOne") != null &&
                      JSON.parse(localStorage.getItem("guessOne"))[0] &&
                      JSON.parse(localStorage.getItem("guessOne"))[0].map(
                        (guess, idx) =>
                          recentGuessOne &&
                          Object.keys(recentGuessOne).includes("word") ? (
                            guess.word === recentGuessOne.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === 0 ? "정답!" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === 0 ? "정답!" : guess.rank}
                              </TdRank>
                            </tr>
                          )
                      )}
                    {localStorage.getItem("guessOne") != null &&
                      JSON.parse(localStorage.getItem("guessOne"))[1] &&
                      JSON.parse(localStorage.getItem("guessOne"))[1].map(
                        (guess, idx) =>
                          recentGuessOne &&
                          Object.keys(recentGuessOne).includes("word") ? (
                            guess.word === recentGuessOne.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === -1 ? "1000위 이상" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === -1 ? "1000위 이상" : guess.rank}
                              </TdRank>
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
                    required
                    type="text"
                    onKeyDown={handleOnKeyPressTwo}
                    value={inputInitializeTwo}
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
                    {recentGuessTwo &&
                    Object.keys(recentGuessTwo).includes("word") ? (
                      <>
                        <RecentTr>
                          <TdNumber>
                            {JSON.parse(localStorage.getItem("guessTwo"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                              (g) => g.word === recentGuessTwo.word
                            )
                              ? JSON.parse(localStorage.getItem("guessTwo"))[0]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[0].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("guess-item.word: " + item.word);
                                  console.log(
                                    "guess-recentGuessTwo: " + recentGuessTwo.word
                                  );
                                  return item.word === recentGuessTwo.word;
                                }).count
                              : localStorage.getItem("guessTwo") &&
                                JSON.parse(localStorage.getItem("guessTwo"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[1].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("item.word: " + item.word);
                                  console.log(
                                    "recentGuessTwo: " + recentGuessTwo.word
                                  );
                                  return item.word === recentGuessTwo.word;
                                })
                              ? localStorage.getItem("guessTwo") &&
                                JSON.parse(localStorage.getItem("guessTwo"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[1].find((item, index, arr) => {
                                  // setRecentGuess(inputValue);
                                  console.log("item.word: " + item.word);
                                  console.log(
                                    "recentGuessTwo: " + recentGuessTwo.word
                                  );
                                  return item.word === recentGuessTwo.word;
                                }).count
                              : recentGuessTwo.count}
                          </TdNumber>
                          <TdGuess>{recentGuessTwo.word}</TdGuess>
                          <TdPercent>
                            {localStorage.getItem("guessTwo") &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                              (g) => g.word === recentGuessTwo.word
                            )
                              ? localStorage.getItem("guessTwo") &&
                                JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                                JSON.parse(localStorage.getItem("guessTwo"))[0]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuessTwo.word;
                                  })
                                  .similarity.toFixed(2)
                              : localStorage.getItem("guessTwo") &&
                                JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                                JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessTwo.word;
                                })
                              ? localStorage.getItem("guessTwo") &&
                                JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                                JSON.parse(localStorage.getItem("guessTwo"))[1]
                                  .find((item, index, arr) => {
                                    return item.word === recentGuessTwo.word;
                                  })
                                  .similarity.toFixed(2)
                              : recentGuessTwo.similarity.toFixed(2)}
                          </TdPercent>
                          <TdRank>
                            {JSON.parse(localStorage.getItem("guessTwo"))[0]
                              .length > 0 &&
                            JSON.parse(localStorage.getItem("guessTwo"))[0].some(
                              (g) => g.word === recentGuessTwo.word
                            )
                              ? JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[0].find((item, index, arr) => {
                                  return item.word === recentGuessTwo.word;
                                }).rank === 0
                                ? "정답!"
                                : JSON.parse(
                                    localStorage.getItem("guessTwo")
                                  )[0].find((item, index, arr) => {
                                    return item.word === recentGuessTwo.word;
                                  }).rank
                              : JSON.parse(localStorage.getItem("guessTwo"))[1]
                                  .length > 0 &&
                                JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessTwo.word;
                                })
                              ? JSON.parse(
                                  localStorage.getItem("guessTwo")
                                )[1].find((item, index, arr) => {
                                  return item.word === recentGuessTwo.word;
                                }).rank === -1
                                ? "1000위 이상"
                                : "이상"
                              : recentGuessTwo.rank === -1
                              ? "1000위 이상"
                              : "이상"}
                          </TdRank>
                        </RecentTr>
                      </>
                    ) : null}
                    {/* {localStorage.getItem("guessTwo") != null &&
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
                      )} */}
                    {localStorage.getItem("guessTwo") != null &&
                      JSON.parse(localStorage.getItem("guessTwo"))[0] &&
                      JSON.parse(localStorage.getItem("guessTwo"))[0].map(
                        (guess, idx) =>
                          recentGuessTwo &&
                          Object.keys(recentGuessTwo).includes("word") ? (
                            guess.word === recentGuessTwo.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === 0 ? "정답!" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === 0 ? "정답!" : guess.rank}
                              </TdRank>
                            </tr>
                          )
                      )}
                    {/* {localStorage.getItem("guessTwo") != null &&
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
                      )} */}
                    {localStorage.getItem("guessTwo") != null &&
                      JSON.parse(localStorage.getItem("guessTwo"))[1] &&
                      JSON.parse(localStorage.getItem("guessTwo"))[1].map(
                        (guess, idx) =>
                          recentGuessTwo &&
                          Object.keys(recentGuessTwo).includes("word") ? (
                            guess.word === recentGuessTwo.word ? null : (
                              <tr>
                                <TdNumber>{guess.count}</TdNumber>
                                <TdGuess>{guess.word}</TdGuess>
                                <TdPercent>
                                  {guess.similarity
                                    ? guess.similarity.toFixed(2)
                                    : guess.similarity}
                                </TdPercent>
                                <TdRank>
                                  {guess.rank === -1 ? "1000위 이상" : guess.rank}
                                </TdRank>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <TdNumber>{guess.count}</TdNumber>
                              <TdGuess>{guess.word}</TdGuess>
                              <TdPercent>
                                {guess.similarity
                                  ? guess.similarity.toFixed(2)
                                  : guess.similarity}
                              </TdPercent>
                              <TdRank>
                                {guess.rank === -1 ? "1000위 이상" : guess.rank}
                              </TdRank>
                            </tr>
                          )
                      )}
                    {/* </tbody> */}
                  </Table>
                </TableContainer>
              </Content>
              {localStorage.getItem("winState") === "1" ||
              localStorage.getItem("winState") === "0" ? null : (
                <GiveUpContainer>
                  <GiveUpButtonContainer>
                    <Button onClick={confirmGiveUp}>포기하기</Button>
                  </GiveUpButtonContainer>
                </GiveUpContainer>
              )}
            </ContentContainer>
          </CenterContainer>
        </Container>
        <Footer />
      </>
    ) : null
  );
}
