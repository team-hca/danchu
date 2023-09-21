import React from 'react';
import styled from "styled-components";

const ModalContainer = styled.div`
  background-color: #253846;
  margin: 40px 0px 40px 0px;
`

const SuccessContent = styled.div`

`

const CongratTitle = styled.span`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 30px;
  margin: 40px 0px 40px 0px;
`
const DanchuDate = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px 10px 0px;
`

const DanchuTrial = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px 10px 0px;
`

const DanchuStreak = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px 10px 0px;
`

const DanchuRank = styled.div`
  color: #FFF7D4;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px 10px 0px;
`

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
        오늘의 단추를 풀었습니다!
      </CongratTitle>
      <SuccessContent>
        <DanchuDate>{danchuDate}</DanchuDate>
        <DanchuTrial>{danchuTrial}</DanchuTrial>
        <DanchuStreak>{danchuStreak}</DanchuStreak>
        <DanchuRank>{danchuRank}</DanchuRank>
      </SuccessContent>
    </ModalContainer>
  );
}
