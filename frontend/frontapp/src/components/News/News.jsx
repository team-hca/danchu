import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NewsBox from "./NewsBox";
import NewsMessage from "./NewsMessage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 720px;
  margin-bottom: 100px;

  @media (max-width: 720px) {
    width: 100vw;
    // padding: 0 15px;
  }
`;

const LoadingMessage = styled.div`
  flex: 1;
  width: 100%;
  max-width: 720px; // Added this line
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 720px) {
    padding: 0 15px;
  }
`;

const Message = styled.div`
  position: relative;
  color: #ffc40e;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  overflow: hidden;
  padding: 5px 0;

  @media (max-width: 720px) {
    font-size: 4vw;
  }
`;

export default function News({ words }) {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(
        `/api/v1/news/link?word1=${words.word1}&word2=${words.word2}&word3=${words.word3}`
      )
      .then((response) => {
        setNewsData(response.data);
        setLoading(false); // 데이터 로드 후 로딩 상태 false로 설정
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("데이터를 가져오지 못함!!!! error : ", error.message);
        setLoading(false); // 에러 발생 시 로딩 상태 false로 설정
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <NewsMessage />
        <LoadingMessage>
          <Message>뉴스를 가져옵니다 ...</Message>
        </LoadingMessage>
      </Container>
    );
  } else {
    return (
      <Container>
        <NewsMessage />
        <NewsBox newsData={newsData} />
      </Container>
    );
  }
}
