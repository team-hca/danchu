import React from "react";
import styled from "styled-components";
import newsBoxImagePath from "../../icon/news_box.png";

const Container = styled.div`
  flex: 1;
  height: auto;
  width: 100%;
  // max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-top: 20px;
`;

const BoxImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: auto;

  // img {
  //   width: 100%;
  //   height: auto;
  // }
`;

const ScrollableContent = styled.div`
  border: none;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  align-items: center;
  overflow-y: auto;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  height: 90%;
  display: flex;
  justify-content: center;
  white-space: pre-line;

  // 스크롤 바의 너비와 높이
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  // 스크롤 바의 배경
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  // 스크롤 바의 실제 부분
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  // 스크롤 바의 실제 부분에 마우스를 올렸을 때
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DummyItem = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: left;
  height: auto;

  title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  content {
    font-weight: 10;
    margin-bottom: 10px;
  }
`;

const ButtonWrapper = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  text-align: left;
  margin-bottom: 10px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);

  title,
  content {
    margin: 0;
    transition: color 0.3s;
    font-size: 25px;
  }

  &:hover {
    title {
      color: #ffc40e;
      text-shadow: none;
    }
  }

  &:hover {
    content {
      color: #007bff;
      text-shadow: none;
    }
  }

  title {
    color: #253846;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
  content {
    color: #253846;
  }
`;

export default function NewsBox() {
  function generateDummyData(count) {
    return Array.from({ length: count }, (_, index) => ({
      title: `김병찬씨, 진짜 보여줘${index + 1}....`,
      content: `동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라만세 
무궁화 삼천리 화려강산
대한사람 대한으로 길이 보전하세`,
      url: `https://www.naver.com`,
    }));
  }

  function NewlineText({ text }) {
    const newText = text.split("\n").map((str, index, array) =>
      index === array.length - 1 ? (
        str
      ) : (
        <>
          {str}
          <br />
        </>
      )
    );

    return <>{newText}</>;
  }

  const dummyData = generateDummyData(12);

  return (
    <Container>
      <BoxImage>
        <img src={newsBoxImagePath} alt="headerBoxImagePath" />
        <OverlayText>
          <ScrollableContent>
            {dummyData.map((data, index) => (
              <DummyItem key={index}>
                <ButtonWrapper onClick={() => window.open(data.url, "_blank")}>
                  <title>{data.title}</title>
                  <content>
                    <NewlineText text={data.content} />
                  </content>
                </ButtonWrapper>
              </DummyItem>
            ))}
          </ScrollableContent>
        </OverlayText>
      </BoxImage>
    </Container>
  );
}
