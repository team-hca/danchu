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
`;

const LoadingMessage = styled.div`
  position: relative;
  color: #ffc40e;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 30px;
  overflow: hidden;
  padding: 5px 0;
`;

function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const words = { word1: "과자", word2: "아이스크림", word3: null };

  useEffect(() => {
    axios
      .get(
        `/api/api/v1/news/link?word1=${words.word1}&word2=${words.word2}&word3=${words.word3}`
      )
      .then((response) => {
        setNewsData(response.data);
        setLoading(false); // 데이터 로드 후 로딩 상태 false로 설정
      })
      .catch((error) => {
        console.error("데이터를 가져오지 못함!!!! error : ", error.message);
        setLoading(false); // 에러 발생 시 로딩 상태 false로 설정
      });
  }, []);

  if (loading) {
    return (
      <>
        <NewsMessage />
        <LoadingMessage> 뉴스를 가져옵니다 ...</LoadingMessage>
      </>
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

export default News;
