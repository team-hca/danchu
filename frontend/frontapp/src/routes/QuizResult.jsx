import React from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Main from "../components/Main/Main";
import News from "../components/News/News";

const Container = styled.div`
  // width: auto;
  display: flex;
  flex-direction: column;
  // overflow-y: auto;
  align-items: center;
  justify-content: center;
`;

export default function QuizResult() {
  return (
    <>
      <Container>
        <Header />
        <Main />
        <News />
        <Footer />
      </Container>
    </>
  );
}
