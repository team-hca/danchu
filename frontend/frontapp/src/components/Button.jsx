import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkStyle = styled(Link)`
  width: 100%;
  display: flex;
  justify-content: center;
  text-decoration: none;
`;

const ButtonStyle = styled.button`
  width: 60%;
  height: 54px;
  background-color: var(--gray-300);

//   border: 1px solid var(--gray-500);
  border-radius: 8px;

  color: var(--secondary);
  font-size: 16px;

  &:hover {
    // border: 1px solid var(--primary);
    border-radius: 8px;
    // border: 1px solid var(--red); 
    background-color: var(--secondary);
    color: var(--gray-200);
  }
`;

export default function Button(props) {
  return (
    <LinkStyle to={props.to}>
      <ButtonStyle onClick={props.onClick}>{props.children}</ButtonStyle>
    </LinkStyle>
  );
}
