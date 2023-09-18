import styled from "styled-components";

const H6Styled = styled.h6`
  font-size: var(--mobile-h6);
  color: ${(props) => props.color};
  font-weight: 700;
  word-break: break-all;
`;

export default function H6({ children, color }) {
  return <H6Styled color={color}>{children}</H6Styled>;
}