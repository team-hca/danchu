import styled from "styled-components";

const TextStyled = styled.input`
  font-size: var(--mobile-text);
  color: ${(props) => props.color};
  weight: 300;
  word-break: break-all;
  width: 88%;
  height: 50px;
  border-radius: 18px;
`;

export default function Text({ children, color }) {
  return <TextStyled color={color}>{children}</TextStyled>;
}