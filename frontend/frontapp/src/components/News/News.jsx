import React from "react";
import styled from "styled-components";
import NewsBox from "./NewsBox";
import NewsMessage from "./NewsMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  height: auto;
  margin-top: 150px;
`;

export default function News() {
  return (
    <Container>
      <NewsMessage />
      <NewsBox />
    </Container>
  );
}
