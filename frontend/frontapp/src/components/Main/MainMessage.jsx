import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Message = styled.div`
  position: relative;
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  overflow: hidden;
  padding: 5px 0;
`;

const RedText = styled.span`
  color: #ef3c5f;
`;

export default function MainMessage() {
  const YEAR = "2023";
  const MONTH = "09";
  const DAY = "17";

  return (
    <Container>
      <Message>
        {`${YEAR}년 ${MONTH}월 ${DAY}일의 `}
        <RedText>단추</RedText>
      </Message>
    </Container>
  );
}
