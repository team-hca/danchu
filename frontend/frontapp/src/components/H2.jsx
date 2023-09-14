import styled from "styled-components";

const H2Styled = styled.h2`
  font-size: var(--mobile-h2);
  font-weight: 700;
  color: ${(props) => props.color};
  word-break: break-all;
`;

const st = ({ children }) => {
  return (
    <p>
      {children.split("\n").map((txt) => (
        <>
          {txt}
          <br />
        </>
      ))}
    </p>
  );
};

export default function H2({ children, color }) {
  return <H2Styled color={color}>{children}</H2Styled>;
}