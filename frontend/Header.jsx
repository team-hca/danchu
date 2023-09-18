import React from "react";
import styled from "styled-components";
import HeaderBox from "./HeaderBox";
import HeaderMessage from "./HeaderMessage";

const Container = styled.div`
  flex: 1;
  justify-content: center;
`;

export default function Header() {
  return (
    <Container>
      <HeaderMessage />
      <HeaderBox />
    </Container>
  );
}
