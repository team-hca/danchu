import React, { useRef, useEffect, useState } from 'react';
import styled from "styled-components";
import confetti from 'canvas-confetti';
import congratDanchu from '../icon/congrat_danchu.png';
import giveupDanchu from '../icon/giveup_danchu.png';

const ModalContainer = styled.div`
  background-color: #253846;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const SuccessContent = styled.div`
  margin: 30px 0px;

  & > div {
    margin-bottom: 12px;
  }
`

const CongratTitle = styled.span`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 30px;
  line-height: 1.3;
  margin: 0px 0px 50px 0px;
`

const SuccessDetail = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px;
`

const CongratContentButton = styled.button`
  position: relative;
  background: #253846;
  border: 1px solid #C9C7B1;
  cursor: pointer;
  color: #FFF7D4;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  margin: 5px 20px;
  border-radius: 10px;
  z-index: 1;

  width: 6.5em;
  height: 2.5em;
`

const ButtonOverlayRectangle = styled.div`
  position: absolute;
  bottom: 1px;
  background-color: #FFF7D4;
  border: 1px solid #C9C7B1;
  border-radius: 10px;
  z-index: 0;

  font-size: 20px;
  width: 5.4em;
  height: 2.4em;
`;

const CopyButtonOverlayRectangle = styled(ButtonOverlayRectangle)`
  right: 165px;
`;

const NewsButtonOverlayRectangle = styled(ButtonOverlayRectangle)`
  right: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  position: relative;
`;

export default function CongratModal() {
  const successContentCopy = useRef(null);
  const [timeHour, setTimeHour] = useState('');
  const [timeMin, setTimeMin] = useState('');
  const [timeSec, setTimeSec] = useState('');
  const [totalGuessCnt, setTotalGuessCnt] = useState('');

  const now = new Date();
  const options = { timeZone: 'Asia/Seoul' };
  const krSeoulTime = now.toLocaleString('en-US', options);

  const dateArray = krSeoulTime.split(', ')[0].split('/');

  const year = parseInt(dateArray[2], 10);
  let month = parseInt(dateArray[0], 10).toString().padStart(2, '0');
  let date = parseInt(dateArray[1], 10).toString().padStart(2, '0');

  const danchuDate = year + "년 " + month + "일 " + date + "일 단추";

  const handleCopyResult = () => {
    let copiedContent;
    const winState = parseInt(localStorage.getItem('winState'));

    if (winState === 1) {
      copiedContent = `${year}년 ${month}월 ${date}일의 단추를 맞혔습니다!
${danchuTrial}
${danchuTime}
https://www.danchu.today/`;
    } else if (winState === 0) {
      copiedContent = `${year}년 ${month}월 ${date}일의 단추를 포기하셨습니다.
${danchuTrial}
${danchuTime}
https://www.danchu.today/`;
    }

    navigator.clipboard.writeText(copiedContent)
      .then(() => {
        alert('결과를 복사하였습니다!');
      })
      .catch(e => {
        console.error('복사 실패:', e);
        alert('결과를 복사하지 못했습니다.');
      });
  }

  const triggerFireworksConfetti = () => {
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 10, spread: 500, ticks: 100, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.1 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.8 } }));
    }, 250);
  }

  const triggerPrideConfetti = () => {
    var end = Date.now() + (3 * 1000);

    var colors = ['#1BE4B2', '#F26481', '#F3E502', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 250,
        origin: { x: -0.1, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 250,
        origin: { x: 1.1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  useEffect(() => {
    const existingEndTime = localStorage.getItem('endTime');
    const startTime = localStorage.getItem('startTime');

    if (!existingEndTime) {
      localStorage.setItem('endTime', Date.now());
    }

    if (startTime && existingEndTime) {
      const elapsedTime = parseInt(existingEndTime, 10) - parseInt(startTime, 10);

      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

      setTimeHour(hours.toString().padStart(2, '0'));
      setTimeMin(minutes.toString().padStart(2, '0'));
      setTimeSec(seconds.toString().padStart(2, '0'));
    }

    // 1번문제
    let guessCnt = 0;
    if (localStorage.getItem('guess')) {
      const guess = localStorage.getItem('guess');
      const guessList = JSON.parse(guess);
      const guessInRank = guessList[0].length;
      const guessOutOfRank = guessList[1].length;
      guessCnt = guessInRank + guessOutOfRank;
    }
    
    // 2번 문제
    let guessOneCnt = 0;
    if (localStorage.getItem('guessOne')) {
      const guessOne = localStorage.getItem('guessOne');
      const guessOneList = JSON.parse(guessOne);
      const guessOneInRank = guessOneList[0].length;
      const guessOneOutOfRank = guessOneList[1].length;
      guessOneCnt = guessOneInRank + guessOneOutOfRank;
    }
    
    // 3번 문제
    let guessTwoCnt = 0;
    if (localStorage.getItem('guessTwo')) {
      const guessTwo = localStorage.getItem('guessTwo');
      const guessTwoList = JSON.parse(guessTwo);
      const guessTwoInRank = guessTwoList[0].length;
      const guessTwoOutOfRank = guessTwoList[1].length;
      guessTwoCnt = guessTwoInRank + guessTwoOutOfRank;
    }

    const totalGuessCnt = guessCnt + guessOneCnt + guessTwoCnt;

    setTotalGuessCnt(totalGuessCnt);
  
    if (parseInt(localStorage.getItem('winState')) === 1) {
      triggerFireworksConfetti();
      triggerPrideConfetti();
    }
    
  }, []);

  const danchuTrial = "시도 횟수: " + totalGuessCnt;
  const danchuTime = "걸린 시간 : " + timeHour + "시간 " + timeMin + "분 " + timeSec + "초";
  const winState = parseInt(localStorage.getItem('winState'));
  
  return (
    <ModalContainer>
      {winState === 1 ? (
        <CongratTitle>
          축하합니다! <br />
          오늘의 단추를 맞혔습니다!
        </CongratTitle>
      ) : winState === 0 ? (
        <CongratTitle>
          오늘의 단추를 포기하셨습니다.
        </CongratTitle>
      ) : null}

      {winState === 1 ? (
        <img src={congratDanchu} alt="Congrat Danchu" style={{ width: '150px' }} />
      ) : winState === 0 ? (
        <img src={giveupDanchu} alt="Giveup Danchu" style={{ width: '200px' }} />
      ) : null}
  
      <SuccessContent ref={successContentCopy}>
        <SuccessDetail>{danchuDate}</SuccessDetail>
        <SuccessDetail>{danchuTrial}</SuccessDetail>
        <SuccessDetail>{danchuTime}</SuccessDetail>
      </SuccessContent>
  
      <ButtonContainer>
        <CongratContentButton onClick={handleCopyResult}>결과 복사</CongratContentButton>
        <CopyButtonOverlayRectangle />
        <CongratContentButton>관련 뉴스</CongratContentButton>
        <NewsButtonOverlayRectangle />
      </ButtonContainer>
    </ModalContainer>
  );
}