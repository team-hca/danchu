import React from 'react';
import errorImage from '../icon/Error.png';
import logo from '../icon/danchu.png';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
    },
    errorCode: {
        fontSize: '6em',
        color: 'var(--primary)',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    errorText: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    image: {
        width: '200px',
        marginBottom: '20px',
    },
    homeLink: {
        color: 'var(--primary)',
        textDecoration: 'none',
        border: '1px solid #ff6b6b',
        padding: '10px 15px',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s, color 0.3s',
    },
    homeLinkHover: {
        backgroundColor: '#ff6b6b',
        color: 'white',
    },
    logostyle:{
        width: '200px',
        marginBottom: '90px'
    }
};

const Error = () => {
    const [hover, setHover] = React.useState(false);

    return (
        <div style={styles.container}>
            <img src={logo} alt="danchu logo" style={styles.logostyle}></img>
            <img src={errorImage} alt="Not Found Image" style={styles.image} />
            <div style={styles.errorCode}>BACK!</div>
            <div style={styles.errorText}>페이지를 찾을 수 없습니다.</div>
            <a 
                href="/quiz"
                style={hover ? {...styles.homeLink, ...styles.homeLinkHover} : styles.homeLink}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                홈으로 돌아가기
            </a>
        </div>
    );
}

export default Error;
