import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkStyle = styled(Link)`
  width: 30%;
  display: flex;
  justify-content: center;
  text-decoration: none;
`;

const ButtonStyle = styled.button`
  width: 80%;
  height: 60px;
  margin-right:-10%;
  background-color: var(--background);
  border-radius: 8px;
  font-family: "tmoney";
  color: var(--secondary);
  font-size: 20px;

  &:hover {
    border-radius: 8px;
    background-color: var(--secondary);
    color: var(--gray-200);
  }
`;

export default function SubmitButton(props) {
  return (
    <LinkStyle to={props.to}>
      <ButtonStyle onClick={props.onClick}>{props.children}</ButtonStyle>
    </LinkStyle>
  );
}
