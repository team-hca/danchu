import React from "react";
import styled from "styled-components";

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
  margin-bottom: 100px;
`;

const NewsInfoBox = styled.div`
  border: 1px solid var(--gray-1000);
  border-radius: 5px;
  width: 100%;
  height: 860px;
  background-color: var(--box);
  word-break: keep-all;
  line-height: 60px;
  box-shadow: 10px 10px 7px rgba(0, 0, 0.5, 0.5);
  text-align: center;
  margin-bottom: 15px;
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
  background-color: var(--box);
  border: 1px solid var(--gray-1000);
  width: 100%;
  border: none;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 1px 1px 2px rgba(37, 56, 70, 1);
`;

const DummyItem = styled.div`
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: left;
  height: auto;
`;

const TitleText = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const ContentText = styled.div`
  font-size: 20px;
  // font-weight: bold;
  margin-bottom: 10px;
`;

const DateText = styled.div`
  font-size: 15px;
  align-self: flex-start;
  margin-left: auto; // Pushes the date to the far right
  color: #777;
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
// 개행 처리 함수
function NewlineText({ text }) {
  if (text) {
    const newText = text.replace(/\n/g, "");
    return <>{newText}</>;
  }
}

export default function NewsBox({ newsData }) {
  function formatContent(contentStr, maxLength = 140) {
    if (!contentStr || typeof contentStr !== "string") {
      return "Invalid Content";
    }

    if (contentStr.length > maxLength) {
      return contentStr.slice(0, maxLength) + "...";
    }

    return contentStr;
  }

  // 날짜 포매팅 함수
  function formatDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") {
      return "Invalid Date";
    }
    const [date, time] = dateStr.split(" ");
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    const hourNumber = parseInt(hour, 10);
    const amOrPm = hourNumber >= 12 ? "오후" : "오전";
    const adjustedHour = hourNumber > 12 ? hourNumber - 12 : hourNumber;

    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(
      day,
      10
    )}일 ${amOrPm} ${adjustedHour}시 ${minute}분`;
  }

  function sortNewsData(newsData) {
    return newsData.sort((a, b) => {
      const dateA = new Date(a.date_time);
      const dateB = new Date(b.date_time);
      return dateB - dateA;
    });
  }

  const sortedNewsData = sortNewsData(newsData);
  console.log(sortedNewsData);

  return (
    <Container>
      <NewsInfoBox>
        <OverlayText>
          <ScrollableContent>
            {[
              ...sortedNewsData,
              {
                title: "끝",
                content: "더 이상의 뉴스가 없습니다.",
                url: "#",
                date: "",
              },
            ].map((sortedNewsData, index, arr) => {
              const isLastItem = index === arr.length - 1;

              if (isLastItem) {
                return (
                  <DummyItem key={sortedNewsData.title + index}>
                    <LastItemTitleText>
                      {sortedNewsData.title}
                    </LastItemTitleText>
                    <LastItemContentText>
                      <NewlineText text={sortedNewsData.content} />
                    </LastItemContentText>
                    {sortedNewsData.date_time && (
                      <DateText>{sortedNewsData.date_time}</DateText>
                    )}
                  </DummyItem>
                );
              } else {
                return (
                  <DummyItem key={sortedNewsData.title + index}>
                    <ButtonWrapper
                      onClick={() => window.open(sortedNewsData.url, "_blank")}
                    >
                      <TitleText>{sortedNewsData.title}</TitleText>
                      <ContentText>
                        <NewlineText
                          text={formatContent(sortedNewsData.content)}
                        />
                      </ContentText>
                    </ButtonWrapper>
                    {sortedNewsData.date_time && (
                      <DateText>
                        {formatDate(sortedNewsData.date_time)}
                      </DateText>
                    )}
                  </DummyItem>
                );
              }
            })}
          </ScrollableContent>
        </OverlayText>
      </NewsInfoBox>
    </Container>
  );
}
