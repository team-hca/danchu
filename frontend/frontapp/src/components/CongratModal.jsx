import React from 'react';
import styled from "styled-components";

const ModalContainer = styled.div`
  background-color: #253846;
  margin: 40px 0px 40px 0px;
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

export default function CongratModal() {
  return (
    <ModalContainer>
      <CongratTitle>
        축하합니다! <br />
        오늘의 단추를 풀었습니다!
      </CongratTitle>
      <div>
        <DanchuDate>단추</DanchuDate>
        <DanchuTrial>시도 횟수 : </DanchuTrial>
        <DanchuStreak>연속으로 맞은 횟수 : </DanchuStreak>
        <DanchuRank>유저 랭킹: 상위 </DanchuRank>
      </div>
    </ModalContainer>
  );
}
