import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import mbtiOption from './mbti.json';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC-UrAmwlqV7nqK7nSU26gy3Ewh1TyVUDw",
    authDomain: "info340-teambti-team7.firebaseapp.com",
    databaseURL: "https://info340-teambti-team7-default-rtdb.firebaseio.com/",
    projectId: "info340-teambti-team7",
    storageBucket: "info340-teambti-team7.appspot.com",
    messagingSenderId: "609914677089",
    appId: "1:609914677089:web:6a000b789bce85619f8720",
    measurementId: "G-485FHCVQD8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App mbtiOption={mbtiOption} />
    </BrowserRouter>
  </React.StrictMode>
);
