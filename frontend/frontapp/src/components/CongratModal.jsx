import React from 'react';
import styled from "styled-components";

const ModalContainer = styled.div`
  background-color: #253846;
  margin: 40px 0px 40px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const SuccessContent = styled.div`
  margin: 50px 0px;

  & > div {
    margin-bottom: 12px;
  }
`

const CongratTitle = styled.span`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 30px;
  line-height: 1.3;
  margin: 50px 0px;
`

const DanchuDate = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px;
`

const DanchuTrial = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px;
`

const DanchuStreak = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px;
`

const DanchuRank = styled.div`
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
  // width: 95px;
  // height: 40px;
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

const now = new Date();
const options = { timeZone: 'Asia/Seoul' };
const krSeoulTime = now.toLocaleString('en-US', options);

const dateArray = krSeoulTime.split(', ')[0].split('/');

const year = parseInt(dateArray[2], 10);
let month = parseInt(dateArray[0], 10).toString().padStart(2, '0');
let date = parseInt(dateArray[1], 10).toString().padStart(2, '0');

const trialCnt = 999999;
const streakCnt = 12341234;
const rankPercentage = 1;

const danchuDate = year + "년 " + month + "일 " + date + "일 단추"
const danchuTrial = "시도 횟수: " + trialCnt
const danchuStreak = "연속으로 맞은 횟수: " + streakCnt
const danchuRank = "유저랭킹: 상위 " + rankPercentage + "%"

export default function CongratModal() {
  return (
    <ModalContainer>
      <CongratTitle>
        축하합니다! <br />
        오늘의 단추를 맞혔습니다!
      </CongratTitle>
      <SuccessContent>
        <DanchuDate>{danchuDate}</DanchuDate>
        <DanchuTrial>{danchuTrial}</DanchuTrial>
        <DanchuStreak>{danchuStreak}</DanchuStreak>
        <DanchuRank>{danchuRank}</DanchuRank>
      </SuccessContent>

      <ButtonContainer>
        <CongratContentButton>결과 복사</CongratContentButton>
        <CopyButtonOverlayRectangle />
        <CongratContentButton>관련 뉴스</CongratContentButton>
        <NewsButtonOverlayRectangle />
      </ButtonContainer>

    </ModalContainer>
  );
}
