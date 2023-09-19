import styled from "styled-components";

const H1Styled = styled.h1`
  font-size: var(--mobile-h1);
  font-weight: 700;
  color: ${(props) => props.color};
  word-break: break-all;
`;

export default function H1({ children, color }) {
  return <H1Styled color={color}>{children}</H1Styled>;
}