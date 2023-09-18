import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 200px;

  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 200px;
`;

const Message = styled.div`
  position: relative;
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 40px;
  overflow: hidden;
`;

export default function Footer() {
  return (
    <Container>
      <Message>이곳은 푸터입니다만 .ㅎ</Message>
    </Container>
  );
}
