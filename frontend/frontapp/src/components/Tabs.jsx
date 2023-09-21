import styled from "styled-components";
export const Tabs = styled.div`
  overflow: hidden;
  font-family: Open Sans;
  height: 3em;
  width: 100%;
`;

export const Tab = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  width: 33.33333333333333333333333333333333333333333333333333333333333333333333333333333333333%;
  position: relative;
  border-radius: 18px 18px 0px 0px;
  // box-shadow: 5px 5px 5px;

  // margin-right: 0.1em;
  font-size: 1em;
  border: ${props => (props.active ? "1px solid #ccc" : "")};
  border-bottom: ${props => (props.active ? "none" : "")};
  background-color: ${props => (props.active ? "var(--primary)" : "var(--secondary)")};
  height: ${props => (props.active ? "3em" : "2.6em; top:.4em")};
  transition: background-color 0.5s ease-in-out;

  :hover {
    background-color: white;
  }
`;

export const Content = styled.div`
  ${props => (props.active ? "" : "display:none")}

`;
