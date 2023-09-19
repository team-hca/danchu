import styled from "styled-components";

const IconContainer = styled.div`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconStyled = styled.div`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.color}; // Pass the color prop to the color CSS property
  font-size: ${(props) => props.fontsize};
`;

export default function Icon({
  clickEvent,
  children,
  outSize,
  inSize,
  color,
  fontsize,
}) {
  return (
    <IconContainer size={outSize} onClick={clickEvent}>
      <IconStyled size={inSize} color={color} fontsize={fontsize}>
        {children}
      </IconStyled>
    </IconContainer>
  );
}