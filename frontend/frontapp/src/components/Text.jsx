import styled from "styled-components";

const TextStyled = styled.input`
  font-size: var(--mobile-text);
  color: ${(props) => props.color};
  weight: 300;
  word-break: break-all;
`;

export default function Text({ children, color }) {
  return <TextStyled color={color}>{children}</TextStyled>;
}
