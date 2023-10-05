import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ResetStyle from './styles/reset';
import "./fonts/font.css";

import { RouterProvider } from 'react-router-dom';
import router from './Router';
import GlobalVariableStyle from './styles/global';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <ResetStyle />
    <RouterProvider router={router}/>
    <GlobalVariableStyle></GlobalVariableStyle>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
