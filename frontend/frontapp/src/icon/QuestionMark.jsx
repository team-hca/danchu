import React, { useState } from "react";
import Modal from "react-modal";

// CSS 스타일을 JavaScript 객체로 정의
const modalStyle = {
  content: {
    width: "60%",
    height: "70%",
    zIndex: 999,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Do Hyeon, sans-serif",
  },
};

const modalTextStyle = {
  textAlign: "center",
  marginTop: "20px",
  marginLeft: "20px",
  marginRight: "20px",
  fontSize: "23px",
  color: "#FF6B6B",
};
const modalHeaderStyle = {
  fontSize: "40px",
  marginBottom: "20px",
  color: "#FF6B6B",
  borderBottom: "2px dotted #FF6B6B",
  paddingBottom: "10px",
};
const buttonStyle = {
  buttonLink: {
    color: "var(--primary)",
    textDecoration: "none",
    border: "1px solid #ff6b6b",
    padding: "10px 15px",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "25px",
    transition: "background-color 0.3s, color 0.3s",
    marginTop: "50px",
  },
  buttonLinkHover: {
    backgroundColor: "#ff6b6b",
    color: "white",
  },
};

const highLightWord = {
  fontSize: "28",
  color: "black",
  fontWeight: "bold",
};

const ModalComponent = ({ isOpen, closeModal }) => {
  const [hover, setHover] = useState(false);
  return (
    <Modal isOpen={isOpen} contentLabel="questionMarkModal" style={modalStyle}>
      <div style={modalTextStyle}>
        <h2 style={modalHeaderStyle}>게임 방식</h2>
        <br></br>
        <p>
          단추 버튼을 누르면 <span style={highLightWord}>입력한 단어</span>와{" "}
          <span style={highLightWord}>정답 단어</span>가 얼마나 유사한지 유사도
          점수로 알려줍니다.
        </p>
        <br></br>
        <p>
          만약, 정답 단어와 가장 비슷한{" "}
          <span style={highLightWord}>1,000개의 단어</span> 안에{" "}
          <span style={highLightWord}>추측한 단어</span>가 있을 때, 단어의{" "}
          <span style={highLightWord}>유사도 순위</span>를 함께 제공합니다.
        </p>
        <br></br>
        <p>
          포기하기 버튼을 누르면{" "}
          <span style={highLightWord}>오늘의 모든 문제</span>를 포기하고, 더
          이상 오늘의 단추를 끼울 수 없습니다.
        </p>
        <br></br>
        <p>숫자가 쓰여진 탭을 누르면 다른 정답 단어를 추측할 수 있습니다.</p>
        <br></br>
      </div>
      <button
        style={
          hover
            ? { ...buttonStyle.buttonLink, ...buttonStyle.buttonLinkHover }
            : buttonStyle.buttonLink
        }
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        닫기
      </button>
    </Modal>
  );
};

export default function QuestionMark() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalHandler = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModalHandler = () => {
    setIsModalOpen(isModalOpen);
  };

  return (
    <svg
      onClick={() => openModalHandler()}
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
    >
      <ModalComponent
        isOpen={isModalOpen}
        closeModal={closeModalHandler}
      />
      <g clipPath="url(#clip0_116_1124)">
        <path
          d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2555 10.7452 48 24 48C37.2555 48 48.0008 37.2555 48.0008 24C48.0008 10.7452 37.2555 0 24 0ZM24 45.0472C12.4207 45.0472 3 35.5792 3 23.9999C3 12.4207 12.4207 2.99991 24 2.99991C35.5793 2.99991 45.0008 12.4207 45.0008 23.9999C45.0008 35.5791 35.5793 45.0472 24 45.0472ZM21.7943 37.5225H25.5682V33.714H21.7943V37.5225ZM23.9557 10.4782C21.7582 10.4782 19.9478 11.0707 18.5258 12.2543C17.1038 13.4385 16.4123 15.81 16.4475 17.775L16.503 17.8845H19.9455C19.9455 16.7122 20.3363 15.0277 21.1178 14.4232C21.8985 13.8195 22.845 13.5172 23.9565 13.5172C25.2375 13.5172 26.2223 13.8652 26.9131 14.5612C27.6031 15.2572 27.9473 16.2524 27.9473 17.5454C27.9473 18.6322 27.6923 19.5599 27.18 20.3287C26.6663 21.0974 25.8053 22.1962 24.5978 23.625C23.352 24.7485 22.5825 25.6515 22.29 26.3347C21.9968 27.0187 21.8445 28.2457 21.8333 30.015H25.4408C25.4408 28.905 25.5112 28.0867 25.6515 27.5617C25.791 27.0375 26.1908 26.445 26.85 25.7857C28.2668 24.4192 29.4045 23.0827 30.2663 21.7755C31.1258 20.4697 31.5563 19.029 31.5563 17.454C31.5563 15.2565 30.8918 13.5442 29.5605 12.318C28.2285 11.091 26.3603 10.4782 23.9557 10.4782Z"
          fill="#253846"
        />
      </g>
      <defs>
        <clipPath id="clip0_116_1124">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
