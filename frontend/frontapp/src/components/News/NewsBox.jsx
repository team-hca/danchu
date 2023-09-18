import React from "react";
import styled from "styled-components";
import newsBoxImagePath from "../../icon/news_box.png";

const Container = styled.div`
  flex: 1;
  height: auto;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  margin-top: 20px;
`;

const BoxImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  // overflow: hidden;
  position: relative;
  width: 1080px;
  height: 320px;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 90%;
  width: 680px;
  display: flex;
  justify-content: center;
  white-space: pre-line;

  // 스크롤 바 스타일
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
const ScrollableContent = styled.div`
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
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
`;

const TitleText = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ContentText = styled.div`
  font-size: 20px;
  // font-weight: bold;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  text-align: left;
  margin-bottom: 10px;

  &:hover {
    transform: scale(1.02);
  }

  &:hover ${TitleText} {
    color: #ffc40e;
    text-shadow: none;
  }

  &:hover ${ContentText} {
    color: #007bff;
    text-shadow: none;
  }

  ${TitleText} {
    color: #253846;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  ${ContentText} {
    color: #253846;
  }
`;

const LastItemTitleText = styled(TitleText)`
  color: #ffc40e; // 색상 변경
  font-size: 35px; // 크기 변경
  text-align: center;
`;

const LastItemContentText = styled(ContentText)`
  color: #007bff; // 색상 변경
  font-size: 25px; // 크기 변경
  text-align: center;
`;

export default function NewsBox() {
  function generateDummyData(count) {
    return Array.from({ length: count }, (_, index) => ({
      title: `김병찬씨, 진짜 보여줘${index + 1}....`,
      content: `동해물과 백두산이 마르고 닳도록 하느님이 보우하사 마르고 닳도록 하느님이 보우하사 마르고 닳도록 하느님이 보우하사 마르고 닳도록 하느님이 보우하사  
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

  // 마지막 항목 추가
  dummyData.push({
    title: "끝",
    content: "더 이상의 뉴스가 없습니다.",
    url: "#",
  });

  return (
    <Container>
      <BoxImage>
        <img src={newsBoxImagePath} alt="headerBoxImagePath" />
        <OverlayText>
          <ScrollableContent>
            {dummyData.map((data, index) => {
              const isLastItem = index === dummyData.length - 1;

              if (isLastItem) {
                return (
                  <DummyItem key={data.title + index}>
                    <LastItemTitleText>{data.title}</LastItemTitleText>
                    <LastItemContentText>
                      <NewlineText text={data.content} />
                    </LastItemContentText>
                  </DummyItem>
                );
              }

              return (
                <DummyItem key={data.title + index}>
                  <ButtonWrapper
                    onClick={() => window.open(data.url, "_blank")}
                  >
                    <TitleText>{data.title}</TitleText>
                    <ContentText>
                      <NewlineText text={data.content} />
                    </ContentText>
                  </ButtonWrapper>
                </DummyItem>
              );
            })}
          </ScrollableContent>
        </OverlayText>
      </BoxImage>
    </Container>
  );
}
