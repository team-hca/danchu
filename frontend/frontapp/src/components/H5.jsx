import styled from "styled-components";

const H5Styled = styled.h5`
  font-size: var(--mobile-h5);
  color: ${(props) => props.color};
  font-weight: 700;
  word-break: break-all;
`;

export default function H5({ children, color }) {
  return <H5Styled color={color}>{children}</H5Styled>;
}