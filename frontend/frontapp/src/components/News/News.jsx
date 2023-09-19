import React from "react";
import styled from "styled-components";
import NewsBox from "./NewsBox";
import NewsMessage from "./NewsMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 720px;
`;

export default function News() {
  return (
    <Container>
      <NewsMessage />
      <NewsBox />
    </Container>
  );
}
