import styled from "styled-components";

const PStyled = styled.p`
  font-size: var(--mobile-p);
  color: ${(props) => props.color};
  font-weight: 300;
  word-break: break-all;
`;

export default function P({ children, color }) {
  return <PStyled color={color}>{children}</PStyled>;
}