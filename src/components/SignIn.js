import React from "react";
import { useEffect } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from 'firebase/database';


export function SignIn(props) {

    const navigate = useNavigate();
    const auth = getAuth();
    const database = getDatabase();

    const firebaseUIConfig = {
        signInOptions: [GoogleAuthProvider.PROVIDER_ID],
        signInFlow: 'popup',
        credentialHelper: 'none',
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
                const user = authResult.user;
                const userRef = ref(database, 'users/' + user.uid);
                set(userRef, {
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    lastLogin: Date.now(),
                    hobby: null,
                    mbtiType: null,
                    pet: null,
                    song: null
                })
                .then(() => {
                    navigate('/profile');
                })
                .catch(error => {
                    console.error("Failed to save user data:", error);
                });
                return false;
            }
        }
    };


    useEffect(() => {
        const changeState = onAuthStateChanged(auth, user => {
            if (user) {
                navigate('/profile');
            }
        });
        return () => changeState();
    }, [navigate, auth]);


    return (
        <div className="login-container">
            <div className="welcome-box"><b>Welcome to teaMBTI</b></div>
            <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
            <div className="create-account">
                <p className="sign-in-tips">If you do not have an account before, it will automatically sign up for you.</p>
            </div>
        </div>
    );
}