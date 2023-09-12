import React from "react";
import styled from "styled-components";
import { useState } from "react";
import H1 from "../components/H1";
import H2 from "../components/H2";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;


 
export default function Quiz() {
  
  return (
    <Container>
      <H1>
        안녕 이건 H1이야
      </H1>
      <H2 color='blue'>
        안녕 이건 H2야
      </H2>
    </Container>
  );
}