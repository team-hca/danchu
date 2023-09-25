import React from "react";
import styled from "styled-components";
import MainBox from "./MainBox";
import MainMessage from "./MainMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 720px;
  margin-bottom: 100px;
`;

export default function Main(props) {
  return (
    <Container>
      <MainMessage />
      <MainBox sentence = {props.sentence} active = {props.active} />
    </Container>
  );
}
