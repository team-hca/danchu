import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 250px;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 200px;
  background: linear-gradient(45deg, #ffe8be, #cfcfb5);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
`;

const A = styled.div`
  widht: 720px;
`;

const ProjectTitle = styled.div`
  color: #fff;
  font-size: 70px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
`;

const TeamName = styled.div`
  color: #253846;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.8;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  position: absolute; // 절대 위치 지정
  bottom: 20px; // 아래에서 10px 떨어진 위치에 배치
  right: 50px; // 오른쪽에서 40px 떨어진 위치에 배치
`;

export default function Footer() {
  return (
    <Container>
      <ProjectTitle>DANCHU。</ProjectTitle>
      <TeamName>Team H.C.A</TeamName>
    </Container>
  );
}
