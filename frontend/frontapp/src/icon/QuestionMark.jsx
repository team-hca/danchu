import React, { useState } from "react";
import Modal from "react-modal";

// CSS 스타일을 JavaScript 객체로 정의
const modalStyle = {
    /* 모달창 크기 */
    width: 50,
    height: 50,

    /* 최상단 위치 */
    zIndex: 999, // 속성 이름도 올바르게 작성

    /* 중앙 배치 */
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    /* 모달창 디자인 */
    backgroundColor: 'gray',
    border: '1px solid black',
    borderRadius: 8,
};

const closeModalButtonStyle = {
    position: 'absolute',
    right: 10,
    top: 10,
};

const ModalComponent = ({ isOpen, openModalHandler }) => {

    return (
        <Modal isOpen={isOpen} contentLabel="questionMarkModal" style={modalStyle}>
            <div >
                <h2>게임 방식</h2>
                <br></br>
                <p>단추 버튼을 누르면 입력한 단어와 정답 단어가 얼마나 유사한지 유사도 점수로 알려줍니다.</p>
                <br></br>
                <p>만약, 정답 단어와 가장 비슷한 1,000개의 단어 안에 추측한 단어가 있을 때, 단어의 유사도 순위를 함께 제공합니다.</p>
                <br></br>
                <p>포기하기 버튼을 누르면 오늘의 모든 문제를 포기하고, 더 이상 오늘의 단추를 끼울 수 없습니다.</p>
                <br></br>
                <p>숫자가 쓰여진 탭을 누르면 다른 정답 단어를 추측할 수 있습니다.</p>
                <br></br>
                <button onClick={openModalHandler} style={closeModalButtonStyle}>
                    x
                </button>
            </div>
        </Modal>
    );
};

export default function QuestionMark() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModalHandler = () => {
        setIsModalOpen(!isModalOpen);
    };

  return (
    <svg  onClick={() => openModalHandler()} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ModalComponent isOpen={isModalOpen} openModalHandler={openModalHandler} />
<g clip-path="url(#clip0_116_1124)">
<path d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2555 10.7452 48 24 48C37.2555 48 48.0008 37.2555 48.0008 24C48.0008 10.7452 37.2555 0 24 0ZM24 45.0472C12.4207 45.0472 3 35.5792 3 23.9999C3 12.4207 12.4207 2.99991 24 2.99991C35.5793 2.99991 45.0008 12.4207 45.0008 23.9999C45.0008 35.5791 35.5793 45.0472 24 45.0472ZM21.7943 37.5225H25.5682V33.714H21.7943V37.5225ZM23.9557 10.4782C21.7582 10.4782 19.9478 11.0707 18.5258 12.2543C17.1038 13.4385 16.4123 15.81 16.4475 17.775L16.503 17.8845H19.9455C19.9455 16.7122 20.3363 15.0277 21.1178 14.4232C21.8985 13.8195 22.845 13.5172 23.9565 13.5172C25.2375 13.5172 26.2223 13.8652 26.9131 14.5612C27.6031 15.2572 27.9473 16.2524 27.9473 17.5454C27.9473 18.6322 27.6923 19.5599 27.18 20.3287C26.6663 21.0974 25.8053 22.1962 24.5978 23.625C23.352 24.7485 22.5825 25.6515 22.29 26.3347C21.9968 27.0187 21.8445 28.2457 21.8333 30.015H25.4408C25.4408 28.905 25.5112 28.0867 25.6515 27.5617C25.791 27.0375 26.1908 26.445 26.85 25.7857C28.2668 24.4192 29.4045 23.0827 30.2663 21.7755C31.1258 20.4697 31.5563 19.029 31.5563 17.454C31.5563 15.2565 30.8918 13.5442 29.5605 12.318C28.2285 11.091 26.3603 10.4782 23.9557 10.4782Z" fill="#253846"/>
</g>
<defs>
<clipPath id="clip0_116_1124">
<rect width="48" height="48" fill="white"/>
</clipPath>
</defs>
</svg>
  );
}


