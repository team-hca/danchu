import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  background-color: rgba(34, 34, 34, 0.7);
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  position: fixed;
  width: 100%;
  top: ${({ isVisible }) =>
    isVisible ? "0" : "-70px"}; // Navbar의 높이만큼 올라가게 설정
  transition: top 0.3s;
  z-index: 10;
`;

const Logo = styled.div`
  flex: 0.5;
  font-size: 1.5em;
  color: #fff;
  font-weight: bold;
`;
const NavCenter = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex: 1.1;
`;

const NavItems = styled.ul`
  display: flex;
  gap: 200px;
  list-style-type: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  cursor: pointer;
  color: #fff;
  transition: color 0.3s;

  &:hover {
    color: #ffc90e;
  }
`;

const MobileMenuIcon = styled.div`
  font-size: 1.8em;
  color: #fff;
  display: none;
`;

export default function Navbar() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // 스크롤 다운 시 Navbar 숨기기, 스크롤 업 시 Navbar 나타내기
      setIsVisible(currentScrollTop < lastScrollTop);

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <Container isVisible={isVisible}>
      <Logo>DANCHU</Logo>
      <NavCenter>
        <NavItems>
          <NavItem>★☆★☆★☆</NavItem>
          <NavItem>☆★☆★☆★</NavItem>
          <NavItem>☆★☆★☆★</NavItem>
        </NavItems>
      </NavCenter>
      <MobileMenuIcon>
        <i className="fas fa-bars"></i>
      </MobileMenuIcon>
    </Container>
  );
}
