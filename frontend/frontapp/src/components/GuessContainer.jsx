import styled from "styled-components";
import Text from "./Text";

const TextContainer = styled.div`
  margin: 40px 0px 40px 0px;
  // margin: 40px 0px 40px 0px;
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
  text-align: center;
`;

const Th = styled.th`
  padding: 15px;
`;

const Td = styled.td`
  padding: 5px;
`;



export default function GuessContainer() {
  return (
    <>
      <TextContainer>
        <Text></Text>
      </TextContainer>
      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>단어추측</Th>
              <Th>유사도</Th>
              <Th>유사도 순위</Th>
            </tr>
          </Thead>
          <tbody>
            <tr>
              <Td>이름</Td>
              <Td>이메일</Td>
              <Td>7.0</Td>
              <Td>1000</Td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
}
