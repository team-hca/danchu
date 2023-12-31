import styled from "styled-components";
import Text from "./Text";
import SubmitButton from "./SubmitButton";
import logoImg from "../icon/danchu_logo.png";

const TextContainer = styled.div`
  margin: 40px 40px 40px 40px;
  
  display:flex;
  justify-content: space-between;
`;

const TableContainer = styled.div`
  background-color: white;
  opacity: 50%;
  // height: 50px;
  margin: 40px;
  padding: 15px;
`;

const Table = styled.table`
  text-align: left;
`;

const Thead = styled.thead`
  text-align: left;
`;

const ThNumber = styled.th`
  padding: 15px;
  width: 70px;
  max-width: 70px;
  min-width: 70px;
  font-weight: 1000;
`;

const ThGuess = styled.th`
  padding: 15px;
  width: 140px;
  max-width: 140px;
  min-width: 140px;
  font-weight: 1000;

`;
const ThPercent = styled.th`
  padding: 15px;
  width: 100px;
  max-width: 100px;
  min-width: 100px;
  font-weight: 1000;
`;

const ThRank = styled.th`
  padding: 15px;
  width: 280px;
  max-width: 280px;
  min-width: 280px;
  font-weight: 1000;
`;
const TdNumber = styled.th`
  padding: 15px;
  width: 70px;
  max-width: 70px;
  min-width: 70px;

`;

const TdGuess = styled.th`
  padding: 15px;
  width: 140px;
  max-width: 140px;
  min-width: 140px;
`;
const TdPercent = styled.th`
  padding: 15px;
  width: 100px;
  max-width: 100px;
  min-width: 100px;
`;

const TdRank = styled.th`
  padding: 15px;
  width: 280px;
  max-width: 280px;
  min-width: 280px;
`;

const onSubmit = () => {
  if(!localStorage.getItem('startTime')) {
    localStorage.setItem('startTime', Date.now());
  }
  // localStorage.setItem();
}



export default function GuessContainer() {

  return (
    <>
      <TextContainer>
        <Text></Text>
          <img src={logoImg} alt="logo img" onClick={onSubmit} style={{ width: '60px', cursor: 'pointer' }} />
        {/*<SubmitButton onClick={onSubmit}>단추</SubmitButton>*/}
      </TextContainer>
      <TableContainer>
        <Table>
          {/* <Thead> */}
            <tr>
              <ThNumber>#</ThNumber>
              <ThGuess>단어추측</ThGuess>
              <ThPercent>유사도</ThPercent>
              <ThRank>유사도 순위</ThRank>
            </tr>
          {/* </Thead> */}
          {/* <tbody> */}
            <tr>
              <TdNumber>이름</TdNumber>
              <TdGuess>이메일</TdGuess>
              <TdPercent>7.0</TdPercent>
              <TdRank>1000</TdRank>
            </tr>
          {/* </tbody> */}
        </Table>
      </TableContainer>
    </>
  );
}
