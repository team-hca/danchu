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
  margin-bottom: 50px;
`;

const Message = styled.div`
  position: relative;
  color: #253846;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  overflow: hidden;
`;

export default function NewsMessage() {
  const message = "오늘의 단추 뉴스";

  return (
    <Container>
      <Message>{message}</Message>
    </Container>
  );
}
